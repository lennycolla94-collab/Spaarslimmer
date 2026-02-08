'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CalculatorWidget } from '@/features/calculator/components';

interface Lead {
  id: string;
  companyName: string;
  phone: string | null;
  email: string | null;
  contactName?: string;
  city?: string;
  province?: string;
  niche?: string;
  doNotCall: boolean;
  consentPhone: boolean;
  status: string;
  calls: Array<{
    id: string;
    result: string;
    calledAt: string;
    notes?: string;
  }>;
}

export default function CallCenterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect als niet ingelogd
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchNextLead = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/queue');
      
      if (response.status === 404) {
        setError('Geen leads meer in de wachtrij. Importeer nieuwe leads.');
        setCurrentLead(null);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Fout bij ophalen lead');
      }
      
      const data = await response.json();
      setCurrentLead(data);
    } catch (err) {
      setError('Kon geen lead ophalen. Probeer opnieuw.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCallSaved = () => {
    setSuccess('Gesprek opgeslagen!');
    setTimeout(() => {
      setSuccess('');
      fetchNextLead(); // Auto-next na opslaan
    }, 1500);
  };

  if (status === 'loading') {
    return <div className="p-8">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Bel Centrum</h1>
          <button
            onClick={fetchNextLead}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Laden...' : 'Volgende Lead'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Success/Error messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* 🆕 GRID LAYOUT: Calls + Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom 1-2: Call UI (2/3 breedte) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Empty state */}
            {!currentLead && !error && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-gray-400 text-6xl mb-4">📞</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Klaar om te bellen?
                </h3>
                <p className="text-gray-500 mb-4">
                  Klik op &quot;Volgende Lead&quot; om de eerste te starten
                </p>
                <button
                  onClick={fetchNextLead}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Start met Bellen
                </button>
              </div>
            )}

            {/* Lead Card */}
            {currentLead && (
              <div className="space-y-4">
                {/* GDPR Warning */}
                {(currentLead.doNotCall || !currentLead.consentPhone) && (
                  <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg font-bold text-center">
                    ⚠️ LET OP: Deze lead heeft geen beltoestemming! Alleen bellen bij Legitimate Interest.
                  </div>
                )}

                {/* Main Info Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mb-2">
                          {currentLead.niche || 'Geen niche'}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {currentLead.companyName}
                        </h2>
                        {currentLead.contactName && (
                          <p className="text-lg text-gray-600 mt-1">
                            Contact: {currentLead.contactName}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {currentLead.city}, {currentLead.province}
                      </span>
                    </div>

                    {/* Big Phone Number */}
                    <div className="bg-gray-50 rounded-lg p-6 text-center mb-4">
                      <a 
                        href={`tel:${currentLead.phone}`}
                        className="text-4xl font-bold text-blue-600 hover:text-blue-800 block mb-2"
                      >
                        {currentLead.phone || 'Geen telefoon'}
                      </a>
                      <p className="text-sm text-gray-500">
                        Klik om te bellen
                      </p>
                    </div>

                    {/* Call Button */}
                    <a
                      href={`tel:${currentLead.phone}`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>📞</span>
                      BEL NU
                    </a>
                  </div>
                </div>

                {/* Call History */}
                {currentLead.calls.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Recente gesprekken</h3>
                    <div className="space-y-2">
                      {currentLead.calls.map((call) => (
                        <div key={call.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">{call.result}</span>
                            {call.notes && (
                              <p className="text-sm text-gray-600 mt-1">{call.notes}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(call.calledAt).toLocaleDateString('nl-BE')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call Result Form */}
                <CallResultForm 
                  leadId={currentLead.id} 
                  onSaved={handleCallSaved} 
                />
              </div>
            )}
          </div>

          {/* 🆕 Kolom 3: Calculator Widget (1/3 breedte) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <CalculatorWidget />
              
              {/* Helper tekst */}
              {currentLead && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">💡 Tip:</p>
                  <p>Bereken de commissie voordat je een offerte maakt voor {currentLead.companyName}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Call Result Form Component
function CallResultForm({ 
  leadId, 
  onSaved 
}: { 
  leadId: string; 
  onSaved: () => void; 
}) {
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          result,
          notes,
          duration: duration ? parseInt(duration) * 60 : 0
        })
      });

      if (!response.ok) throw new Error('Fout bij opslaan');

      setResult('');
      setNotes('');
      setDuration('');
      onSaved();
    } catch (error) {
      alert('Kon gesprek niet opslaan. Probeer opnieuw.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const results = [
    { value: 'NO_ANSWER', label: 'Geen antwoord', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONVERSATION', label: 'Gesprek gehad', color: 'bg-green-100 text-green-800' },
    { value: 'VOICEMAIL', label: 'Voicemail ingesproken', color: 'bg-blue-100 text-blue-800' },
    { value: 'WRONG_NUMBER', label: 'Verkeerd nummer', color: 'bg-red-100 text-red-800' },
    { value: 'CALLBACK_REQUESTED', label: 'Callback afgesproken', color: 'bg-purple-100 text-purple-800' },
    { value: 'NOT_INTERESTED', label: 'Niet geïnteresseerd', color: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Gesprek resultaat</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resultaat *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {results.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setResult(r.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  result === r.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${r.color}`}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gespreksduur (minuten)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Bijv. 5"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notities
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Belangrijke punten uit het gesprek..."
          />
        </div>

        <button
          type="submit"
          disabled={!result || submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {submitting ? 'Opslaan...' : 'Opslaan & Volgende'}
        </button>
      </form>
    </div>
  );
}
