import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, type, date, time, notes } = await request.json();

    if (!leadId || !type || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify ownership of the lead
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, ownerId: session.user.id }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Create the appointment
    const appointment = await prisma.$executeRaw`
      INSERT INTO appointments (leadid, type, appointmentdate, appointmenttime, notes, status, createdat, updatedat) 
      VALUES (${leadId}, ${type}, ${date}, ${time}, ${notes || null}, 'SCHEDULED', NOW(), NOW())
    `;

    // Create call log for appointment scheduling
    await prisma.$executeRaw`
      INSERT INTO calls (leadid, consultantid, calledat, duration, result, notes) 
      VALUES (${leadId}, ${session.user.id}, NOW(), 0, 'APPOINTMENT', ${`Afspraak gepland: ${date} ${time} (${type})`})
    `;

    // Update lead status to CONTACTED
    await prisma.$executeRaw`
      UPDATE "Lead" SET status = 'CONTACTED', updatedat = NOW() WHERE id = ${leadId}
    `;

    return NextResponse.json({ success: true, message: 'Appointment created' });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    let appointments: any[];

    if (leadId) {
      appointments = await prisma.$queryRaw`
        SELECT * FROM appointments WHERE leadid = ${leadId} ORDER BY appointmentdate DESC, appointmenttime DESC
      `;
    } else {
      // Get appointments for all leads owned by this user
      appointments = await prisma.$queryRaw`
        SELECT a.* FROM appointments a
        JOIN "Lead" l ON a.leadid = l.id
        WHERE l.ownerid = ${session.user.id}
        ORDER BY a.appointmentdate DESC, a.appointmenttime DESC
      `;
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
