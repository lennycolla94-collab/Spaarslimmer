import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/features/auth/services/auth';
import { CSVUploader } from '@/components/import/csv-uploader';

export default async function ImportLeadsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
            <li>• Gebruik het template voor de juiste kolomnamen</li>
            <li>• Telefoonnummers worden automatisch geformatteerd</li>
            <li>• Duplicaten (zelfde telefoonnummer) worden overgeslagen</li>
            <li>• Maximaal 1000 leads per import</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
