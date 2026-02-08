import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/features/auth/services/auth';
import { prisma } from '@/shared/db/prisma';
import Link from 'next/link';

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const leads = await prisma.lead.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { calls: true }
      }
    },
    take: 50
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUOTED': return 'bg-purple-100 text-purple-800';
      case 'SALE_MADE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW': return 'Nieuw';
      case 'CONTACTED': return 'Gecontacteerd';
      case 'QUOTED': return 'Offerte';
      case 'SALE_MADE': return 'Verkocht';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">👥 Mijn Leads</h1>
          <Link
            href="/leads/import"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>+</span>
            Importeer Leads
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium mb-2">Nog geen leads</h3>
            <p className="text-gray-500 mb-4">Importeer je eerste leads om te starten</p>
            <Link
              href="/leads/import"
              className="text-blue-600 hover:underline font-medium"
            >
              Ga naar importeren →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Bedrijf</th>
                  <th className="text-left p-4 font-semibold">Contact</th>
                  <th className="text-left p-4 font-semibold">Locatie</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Gesprekken</th>
                  <th className="text-left p-4 font-semibold">Actie</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{lead.companyName}</div>
                      {lead.niche && (
                        <div className="text-sm text-gray-500">{lead.niche}</div>
                      )}
                    </td>
                    <td className="p-4">
                      {lead.encryptedPhone && (
                        <div className="text-sm">
                          <a href={`tel:${lead.encryptedPhone}`} className="text-blue-600 hover:underline">
                            {lead.encryptedPhone.substring(0, 20)}...
                          </a>
                        </div>
                      )}
                      {lead.encryptedEmail && (
                        <div className="text-sm text-gray-500">
                          {lead.encryptedEmail.substring(0, 25)}...
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {lead.city}
                      {lead.province && <span className="text-gray-500">, {lead.province}</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                      {lead.doNotCall && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Niet bellen
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {lead._count.calls} gesprek{lead._count.calls !== 1 ? 'ken' : ''}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/call-center?lead=${lead.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Bellen →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
