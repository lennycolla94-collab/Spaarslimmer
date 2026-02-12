'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  StatCard, 
  ActionButton,
  EmptyState,
  Badge,
  SearchInput
} from '@/components/design-system/page-container';
import { useTranslation } from '@/components/language-provider';
import { 
  Users, 
  Plus, 
  Phone, 
  PhoneOff,
  Mail, 
  MapPin, 
  Building2,
  AlertCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  X,
  Edit2,
  Save,
  Clock,
  CalendarDays,
  MapPinned,
  FileText,
  Check
} from 'lucide-react';

const statusConfig: Record<string, { labelKey: 'statusNew' | 'statusContacted' | 'statusQuoted' | 'statusSold' | 'statusNotInterested'; color: string; icon: any }> = {
  NEW: { labelKey: 'statusNew', color: 'info', icon: AlertCircle },
  CONTACTED: { labelKey: 'statusContacted', color: 'warning', icon: Phone },
  QUOTED: { labelKey: 'statusQuoted', color: 'default', icon: CheckCircle2 },
  SALE_MADE: { labelKey: 'statusSold', color: 'success', icon: CheckCircle2 },
  NOT_INTERESTED: { labelKey: 'statusNotInterested', color: 'error', icon: PhoneOff },
};

// Lead Edit Modal Component
function LeadEditModal({ lead, isOpen, onClose, onSave }: { 
  lead: any; 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (updatedLead: any) => void;
}) {
  const { t } = useTranslation();
  const [editedLead, setEditedLead] = useState(lead);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, ...editedLead }),
      });
      if (response.ok) {
        onSave(editedLead);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <SmartCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('edit')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{lead.companyName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('companyName')}</label>
              <input type="text" value={editedLead.companyName || ''} onChange={(e) => setEditedLead({...editedLead, companyName: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('contactName')}</label>
              <input type="text" value={editedLead.contactName || ''} onChange={(e) => setEditedLead({...editedLead, contactName: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('phone')}</label>
              <input type="text" value={editedLead.phone || ''} onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('email')}</label>
              <input type="email" value={editedLead.email || ''} onChange={(e) => setEditedLead({...editedLead, email: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('address')}</label>
              <input type="text" value={editedLead.address || ''} onChange={(e) => setEditedLead({...editedLead, address: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('city')}</label>
              <input type="text" value={editedLead.city || ''} onChange={(e) => setEditedLead({...editedLead, city: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('postalCode')}</label>
              <input type="text" value={editedLead.postalCode || ''} onChange={(e) => setEditedLead({...editedLead, postalCode: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('niche')}</label>
              <input type="text" value={editedLead.niche || ''} onChange={(e) => setEditedLead({...editedLead, niche: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              {t('cancel')}
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? '...' : t('save')}
            </button>
          </div>
        </div>
      </SmartCard>
    </div>
  );
}

// Appointment Modal Component
function AppointmentModal({ lead, isOpen, onClose }: { lead: any; isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<'phone' | 'physical' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncToGoogle, setSyncToGoogle] = useState(true);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [googleEventLink, setGoogleEventLink] = useState<string | null>(null);

  // Check if user has Google Calendar linked
  useEffect(() => {
    const checkGoogleCalendar = async () => {
      try {
        const response = await fetch('/api/calendar/google/status');
        if (response.ok) {
          const data = await response.json();
          setGoogleLinked(data.connected);
          if (data.authUrl) {
            setGoogleAuthUrl(data.authUrl);
          }
        }
      } catch (error) {
        console.log('Google Calendar not connected');
      }
    };
    checkGoogleCalendar();
  }, []);

  // Check for OAuth callback (access_token in URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
      setGoogleLinked(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Eerst afspraak opslaan in database
      const appointmentRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          type: appointmentType,
          date: selectedDate,
          time: selectedTime,
          notes,
        }),
      });

      // Sync naar Google Calendar indien aangevinkt
      if (syncToGoogle && googleLinked) {
        try {
          const googleToken = localStorage.getItem('google_access_token');
          if (googleToken) {
            const calendarRes = await fetch('/api/calendar/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                leadId: lead.id,
                type: appointmentType,
                date: selectedDate,
                time: selectedTime,
                notes,
                accessToken: googleToken,
              }),
            });
            
            if (calendarRes.ok) {
              const calendarData = await calendarRes.json();
              setSyncStatus('success');
              setGoogleEventLink(calendarData.htmlLink);
            } else {
              setSyncStatus('error');
            }
          }
        } catch (calendarError) {
          console.error('Google Calendar sync failed:', calendarError);
          setSyncStatus('error');
        }
      }

      onClose();
      setStep(1);
      setAppointmentType(null);
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
    } catch (error) {
      console.error('Failed to save appointment:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <SmartCard className="w-full max-w-lg animate-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('scheduleAppointment')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{lead.companyName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">{t('appointmentType')}:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setAppointmentType('phone'); setStep(2); }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    appointmentType === 'phone' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <Phone className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <p className="font-semibold text-slate-800 dark:text-white">{t('phoneCall')}</p>
                </button>
                <button
                  onClick={() => { setAppointmentType('physical'); setStep(2); }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    appointmentType === 'physical' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <MapPinned className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <p className="font-semibold text-slate-800 dark:text-white">{t('physicalVisit')}</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Address Verification (Physical only) */}
          {step === 2 && appointmentType === 'physical' && (
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">{t('verifyAddress')}:</p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-semibold text-slate-900 dark:text-white">{lead.companyName}</p>
                <p className="text-slate-600 dark:text-slate-400">{lead.address || '-'}</p>
                <p className="text-slate-600 dark:text-slate-400">{lead.postalCode} {lead.city}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{t('email')}: {lead.email || '-'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  {t('back')}
                </button>
                <button onClick={() => setStep(3)} className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  {t('confirmAndContinue')}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 || (step === 2 && appointmentType === 'phone') ? (
            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">{t('selectDate')}:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      className={`flex-shrink-0 p-3 rounded-xl text-center min-w-[70px] transition-all ${
                        selectedDate === date.toISOString().split('T')[0]
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <p className="text-xs uppercase">{date.toLocaleDateString('nl-BE', { weekday: 'short' })}</p>
                      <p className="text-lg font-bold">{date.getDate()}</p>
                      <p className="text-xs">{date.toLocaleDateString('nl-BE', { month: 'short' })}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">{t('selectTime')}:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">{t('notes')}:</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('appointmentNotesPlaceholder')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-20 resize-none"
                />
              </div>

              {/* Google Calendar Sync */}
              {!googleLinked && googleAuthUrl ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    🔗 Koppel Google Calendar om afspraken automatisch te synchroniseren
                  </p>
                  <a
                    href={googleAuthUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Koppel Google Calendar
                  </a>
                </div>
              ) : googleLinked ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <input
                    type="checkbox"
                    id="googleCalendar"
                    checked={syncToGoogle}
                    onChange={(e) => setSyncToGoogle(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="googleCalendar" className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    ✅ Gekoppeld - Toevoegen aan Google Calendar
                  </label>
                </div>
              ) : null}

              {/* Sync Status */}
              {syncStatus === 'success' && googleEventLink && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    ✅ Afspraak toegevoegd aan Google Calendar!
                  </p>
                  <a
                    href={googleEventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    📅 Open in Google Calendar
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => appointmentType === 'physical' ? setStep(2) : setStep(1)} 
                  className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl"
                >
                  {t('back')}
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={!selectedDate || !selectedTime || saving}
                  className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {saving ? '...' : t('schedule')}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </SmartCard>
    </div>
  );
}

export default function LeadsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [appointmentLead, setAppointmentLead] = useState<any>(null);
  const [newLead, setNewLead] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    niche: '',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    quoted: leads.filter(l => l.status === 'QUOTED').length,
    sold: leads.filter(l => l.status === 'SALE_MADE').length,
  };

  const handleAddLead = async () => {
    if (!newLead.companyName || !newLead.phone) return;
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      if (response.ok) {
        const savedLead = await response.json();
        setLeads([savedLead, ...leads]);
        setNewLead({ companyName: '', contactName: '', phone: '', email: '', city: '', niche: '' });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  const handleSaveEdit = (updatedLead: any) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? { ...l, ...updatedLead } : l));
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('leads')}
        subtitle={t('dashboard')}
        icon={<Users className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              {t('dashboard')}
            </ActionButton>
            <ActionButton onClick={() => setShowAddModal(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
              {t('addLead')}
            </ActionButton>
            <ActionButton href="/leads/import" variant="secondary" icon={<Upload className="w-4 h-4" />}>
              {t('importLeads')}
            </ActionButton>
          </div>
        }
        stats={[
          { label: t('totalLeads'), value: stats.total.toString() },
          { label: t('newThisWeek'), value: `+${stats.new}`, trend: '+12%' },
          { label: t('conversionRate'), value: '24%', trend: '+5%' },
          { label: t('toCall'), value: stats.new.toString() },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label={t('total')} value={stats.total} icon={<Users className="w-5 h-5" />} color="orange" />
          <StatCard label={t('new')} value={stats.new} icon={<AlertCircle className="w-5 h-5" />} color="blue" />
          <StatCard label={t('contacted')} value={stats.contacted} icon={<Phone className="w-5 h-5" />} color="yellow" />
          <StatCard label={t('quoted')} value={stats.quoted} icon={<CheckCircle2 className="w-5 h-5" />} color="purple" />
          <StatCard label={t('sold')} value={stats.sold} icon={<CheckCircle2 className="w-5 h-5" />} color="green" trend="up" trendValue="+2" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'SALE_MADE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300'
                }`}
              >
                {status === 'ALL' ? t('statusAll') : t(statusConfig[status]?.labelKey || 'statusNew')}
                {status !== 'ALL' && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === status ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {status === 'NEW' ? stats.new : status === 'CONTACTED' ? stats.contacted : status === 'QUOTED' ? stats.quoted : stats.sold}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Grid */}
        {loading ? (
          <SmartCard className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">{t('loading')}</p>
            </div>
          </SmartCard>
        ) : filteredLeads.length === 0 ? (
          <SmartCard>
            <EmptyState
              icon={<Users className="w-10 h-10" />}
              title={t('noLeadsFound')}
              description={searchQuery ? t('search') + "..." : t('noLeadsDescription')}
              action={
                <ActionButton onClick={() => setShowAddModal(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
                  {t('addFirstLead')}
                </ActionButton>
              }
            />
          </SmartCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status];
              const StatusIcon = status?.icon || AlertCircle;
              
              return (
                <SmartCard 
                  key={lead.id} 
                  className={`group ${lead.doNotCall ? 'border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5' : ''}`}
                >
                  <div className="p-5">
                    {/* DNCM Warning */}
                    {lead.doNotCall && (
                      <div className="mb-4 p-3 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                        <p className="text-rose-700 dark:text-rose-400 font-semibold text-sm flex items-center gap-2">
                          <PhoneOff className="w-4 h-4" />
                          DNCM - {t('dncm')}
                        </p>
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${lead.doNotCall ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20'}`}>
                          <Building2 className={`w-6 h-6 ${lead.doNotCall ? 'text-rose-600 dark:text-rose-400' : 'text-orange-600 dark:text-orange-400'}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">{lead.companyName}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{lead.contactName || '-'}</p>
                        </div>
                      </div>
                      <Badge variant={status?.color as any || 'default'}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {t(status?.labelKey || 'statusNew')}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 truncate">
                          {lead.phone}
                        </a>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400 truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">{lead.city}</span>
                          {lead.niche && (
                            <span className="text-slate-400 dark:text-slate-500">• {lead.niche}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <button 
                        onClick={() => setEditingLead(lead)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        {t('edit')}
                      </button>
                      <button 
                        onClick={() => setAppointmentLead(lead)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:shadow-md transition-all"
                      >
                        <Calendar className="w-4 h-4" />
                        {t('scheduleAppointment')}
                      </button>
                      <a 
                        href={`/call-center?lead=${lead.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-md transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        {t('call')}
                      </a>
                    </div>
                  </div>
                </SmartCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <LeadEditModal 
        lead={editingLead} 
        isOpen={!!editingLead} 
        onClose={() => setEditingLead(null)}
        onSave={handleSaveEdit}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        lead={appointmentLead}
        isOpen={!!appointmentLead}
        onClose={() => setAppointmentLead(null)}
      />

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <SmartCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('addLead')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('addFirstLead')}</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('companyName')} *</label>
                  <input type="text" value={newLead.companyName} onChange={(e) => setNewLead({...newLead, companyName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('contactName')}</label>
                  <input type="text" value={newLead.contactName} onChange={(e) => setNewLead({...newLead, contactName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('phone')} *</label>
                  <input type="text" value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('email')}</label>
                  <input type="email" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('city')}</label>
                  <input type="text" value={newLead.city} onChange={(e) => setNewLead({...newLead, city: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('niche')}</label>
                  <input type="text" value={newLead.niche} onChange={(e) => setNewLead({...newLead, niche: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
                  {t('cancel')}
                </button>
                <button onClick={handleAddLead} disabled={!newLead.companyName || !newLead.phone} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all">
                  {t('save')}
                </button>
              </div>
            </div>
          </SmartCard>
        </div>
      )}
    </PageContainer>
  );
}
