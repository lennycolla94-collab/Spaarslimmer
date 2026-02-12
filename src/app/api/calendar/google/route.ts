import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering (uses headers/session)
export const dynamic = 'force-dynamic';

// Google Calendar API integratie
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

// POST - Maak afspraak aan in Google Calendar
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, type, date, time, notes, accessToken } = await request.json();

    // Haal lead gegevens op
    const lead = await prisma.$queryRaw`
      SELECT companyname, contactname, email, phone, address, city, postalcode
      FROM "Lead" 
      WHERE id = ${leadId} AND ownerid = ${session.user.id}
      LIMIT 1
    `;

    if (!(lead as any[]).length) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const leadData = (lead as any[])[0];

    // Maak Google Calendar event
    const event = {
      summary: type === 'physical' 
        ? `🤝 Bezoek: ${leadData.companyname}` 
        : `📞 Call: ${leadData.companyname}`,
      description: `
Contact: ${leadData.contactname || 'Onbekend'}
Telefoon: ${leadData.phone}
Email: ${leadData.email || 'N/A'}

Notities:
${notes || 'Geen notities'}
      `.trim(),
      location: type === 'physical' 
        ? `${leadData.address || ''}, ${leadData.postalcode || ''} ${leadData.city || ''}`.trim() || undefined
        : undefined,
      start: {
        dateTime: `${date}T${time}:00`,
        timeZone: 'Europe/Brussels',
      },
      end: {
        // Default 30 min voor call, 60 min voor fysiek bezoek
        dateTime: type === 'physical' 
          ? `${date}T${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:${time.split(':')[1]}:00`
          : `${date}T${String(parseInt(time.split(':')[0])).padStart(2, '0')}:${String(parseInt(time.split(':')[1]) + 30).padStart(2, '0')}:00`,
        timeZone: 'Europe/Brussels',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },    // 1 uur van tevoren
          { method: 'popup', minutes: 15 },    // 15 min van tevoren
        ],
      },
      colorId: type === 'physical' ? '6' : '9', // Oranje voor fysiek, blauw voor call
    };

    // Debug log
    console.log('Creating calendar event:', {
      leadId,
      date,
      time,
      hasAccessToken: !!accessToken,
    });

    // Call Google Calendar API
    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Google Calendar error:', error);
      return NextResponse.json(
        { error: 'Failed to create calendar event', details: error },
        { status: 500 }
      );
    }

    const googleEvent = await response.json();

    // Sla Google Event ID op in database (voor later bewerken/verwijderen)
    await prisma.$executeRaw`
      UPDATE appointments 
      SET googleeventid = ${googleEvent.id}
      WHERE leadid = ${leadId} 
      AND appointmentdate = ${date} 
      AND appointmenttime = ${time}
    `;

    return NextResponse.json({
      success: true,
      googleEventId: googleEvent.id,
      htmlLink: googleEvent.htmlLink, // Link naar event in Google Calendar
    });

  } catch (error: any) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with calendar', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Verwijder afspraak uit Google Calendar
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { googleEventId, accessToken } = await request.json();

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 410) { // 410 = already deleted
      throw new Error('Failed to delete calendar event');
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Calendar delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
}
