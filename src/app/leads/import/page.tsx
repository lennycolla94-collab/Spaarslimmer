import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { CSVUploader } from '@/components/import/csv-uploader';
import Link from 'next/link';

export default async function ImportLeadsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-4">
        <Link 
          href="/leads"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Terug naar Leads
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">📁 Leads Importeren</h1>
            <p className="text-blue-100">
              Upload een CSV bestand met leads
            </p>
          </div>

          <div className="p-6">
            <CSVUploader />
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Vereist:</strong> Bedrijfsnaam, TelefoonNummer</li>
            <li>• <strong>Optioneel:</strong> Contactpersoon, Niche, Adres, Postcode, Gemeente, Provincie, Email, HuidigeProvider</li>
            <li>• Gebruik het template voor de juiste kolomnamen</li>
            <li>• CSV moet <strong>; (puntkomma)</strong> gescheiden zijn (Excel formaat)</li>
            <li>• Duplicaten (zelfde telefoonnummer) worden overgeslagen</li>
            <li>• Maximaal <strong>1000 leads</strong> per import</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
