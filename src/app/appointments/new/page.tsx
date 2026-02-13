'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock,
  MapPin,
  FileText,
  Save,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const MOCK_LEADS = [
  { id: '1', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters' },
  { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen' },
  { id: '3', companyName: 'NecmiCuts', contactName: 'Necmi Yildiz' },
  { id: '4', companyName: 'Fashion Store', contactName: 'Lisa Dubois' },
];

const APPOINTMENT_TYPES = [
  { value: 'INTAKE', label: 'Intake Gesprek' },
  { value: 'FOLLOW_UP', label: 'Follow-up' },
  { value: 'OFFER', label: 'Offerte Bespreking' },
  { value: 'CLOSING', label: 'Closing' },
  { value: 'INSTALLATION', label: 'Installatie' },
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    leadId: '',
    date: '',
    time: '',
    type: 'INTAKE',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      router.push('/appointments');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <PremiumLayout user={{ name: 'Lenny De K.' }}>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Afspraak Gepland!</h2>
            <p className="text-gray-500">Je wordt doorgestuurd naar de afspraken pagina...</p>
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
          href="/appointments" 
          className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nieuwe Afspraak</h1>
          <p className="text-gray-500 dark:text-gray-400">Plan een nieuwe afspraak met een lead</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Lead Selection */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Selecteer Lead
            </h2>
            <select
              value={formData.leadId}
              onChange={(e) => setFormData(prev => ({ ...prev, leadId: e.target.value }))}
              required
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

          {/* Date & Time */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Datum & Tijd
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Datum
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tijd
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Type & Location */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Type & Locatie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type Afspraak
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
                >
                  {APPOINTMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Locatie
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Adres of "Online""
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
                  />
                </div>
              </div>
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
              placeholder="Optionele notities voor deze afspraak..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 dark:bg-slate-900 flex items-center justify-between">
            <Link
              href="/appointments"
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.leadId || !formData.date || !formData.time}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Bezig...' : 'Afspraak Plannen'}
            </button>
          </div>
        </form>
      </div>
    </PremiumLayout>
  );
}
