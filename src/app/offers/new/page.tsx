'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Building2,
  Save,
  Send,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import Link from 'next/link';

const MOCK_LEADS = [
  { id: '1', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters' },
  { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen' },
  { id: '3', companyName: 'NecmiCuts', contactName: 'Necmi Yildiz' },
  { id: '4', companyName: 'Fashion Store', contactName: 'Lisa Dubois' },
];

export default function NewOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const leadIdFromUrl = searchParams.get('lead');
  const [formData, setFormData] = useState({
    leadId: leadIdFromUrl || '',
    products: [] as string[],
    notes: '',
    status: 'DRAFT'
  });
  
  // Update form when URL param changes
  useEffect(() => {
    if (leadIdFromUrl) {
      setFormData(prev => ({ ...prev, leadId: leadIdFromUrl }));
    }
  }, [leadIdFromUrl]);

  const handleSubmit = async (e: React.FormEvent, sendNow = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      router.push('/offers');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <PremiumLayout user={{ name: 'Lenny De K.' }}>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Offerte Aangemaakt!</h2>
            <p className="text-gray-500 dark:text-gray-400">Je wordt doorgestuurd naar de offers pagina...</p>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/offers" 
          className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nieuwe Offerte</h1>
          <p className="text-gray-500 dark:text-gray-400">Maak een nieuwe offerte voor een lead</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <form className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Lead Selection */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Selecteer Lead
            </h2>
            <select
              value={formData.leadId}
              onChange={(e) => setFormData(prev => ({ ...prev, leadId: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
            >
              <option value="">Kies een lead...</option>
              {MOCK_LEADS.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.companyName} - {lead.contactName}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-orange-50 dark:bg-orange-500/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Gebruik de Prijs Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bereken de beste prijs voor je klant</p>
              </div>
              <Link
                href="/calculator"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Open Calculator
              </Link>
            </div>
          </div>

          {/* Notes */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              Notities
            </h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Optionele notities voor deze offerte..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 dark:bg-slate-900 flex items-center justify-between">
            <Link
              href="/offers"
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Annuleren
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isSubmitting || !formData.leadId}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Bezig...' : 'Opslaan als Concept'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isSubmitting || !formData.leadId}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Offerte Versturen
              </button>
            </div>
          </div>
        </form>
      </div>
    </PremiumLayout>
  );
}
