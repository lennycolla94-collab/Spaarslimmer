'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  EmptyState,
  Badge,
} from '@/components/design-system/page-container';
import { useTranslation } from '@/components/language-provider';
import { 
  Phone, 
  PhoneOff,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  MessageSquare,
  History,
  Play,
  Pause,
  SkipForward,
  AlertCircle,
  Clock3,
  Search,
  User,
  Briefcase,
  Target,
  Check,
  X,
  Edit2,
  Save,
  CalendarDays,
  MapPinned
} from 'lucide-react';

interface Lead {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  province: string | null;
  niche: string | null;
  currentProvider: string | null;
  status: string;
  notes: string | null;
  doNotCall: boolean;
  callAttempts: number;
  lastCallDate?: string;
}

interface CallLog {
  id: string;
  date: string;
  duration: string;
  outcome: string;
  notes: string;
}

const callOutcomes = [
  { value: 'INTERESTED', label: 'Geïnteresseerd', color: 'green', icon: CheckCircle2 },
  { value: 'NOT_INTERESTED', label: 'Geen Interesse', color: 'red', icon: XCircle },
  { value: 'DNCM', label: 'DNCM - Niet Bellen!', color: 'rose', icon: PhoneOff },
  { value: 'CALLBACK', label: 'Terugbellen', color: 'blue', icon: Clock },
  { value: 'APPOINTMENT', label: 'Afspraak Maken', color: 'purple', icon: Calendar },
  { value: 'NO_ANSWER', label: 'Geen Antwoord', color: 'gray', icon: PhoneOff },
  { value: 'QUOTED', label: 'Offerte Verstuurd', color: 'purple', icon: FileText },
  { value: 'SALE', label: 'Verkoop!', color: 'orange', icon: Target },
];

// Appointment Modal Component
function AppointmentModal({ lead, isOpen, onClose }: { lead: any; isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<'phone' | 'physical' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/appointments', {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <SmartCard className="w-full max-w-lg animate-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Afspraak Maken</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{lead.companyName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">Type afspraak:</p>
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
                  <p className="font-semibold text-slate-800 dark:text-white">Telefonisch</p>
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
                  <p className="font-semibold text-slate-800 dark:text-white">Fysiek bezoek</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && appointmentType === 'physical' && (
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">Adres verifiëren:</p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-semibold text-slate-900 dark:text-white">{lead.companyName}</p>
                <p className="text-slate-600 dark:text-slate-400">{lead.address || '-'}</p>
                <p className="text-slate-600 dark:text-slate-400">{lead.postalCode} {lead.city}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">E-mail: {lead.email || '-'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  Terug
                </button>
                <button onClick={() => setStep(3)} className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  Bevestigen & Doorgaan
                </button>
              </div>
            </div>
          )}

          {(step === 3 || (step === 2 && appointmentType === 'phone')) && (
            <div className="space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">Selecteer datum:</p>
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

              {selectedDate && (
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">Selecteer tijd:</p>
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

              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">Notities:</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Extra informatie voor de afspraak..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => appointmentType === 'physical' ? setStep(2) : setStep(1)} 
                  className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl"
                >
                  Terug
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={!selectedDate || !selectedTime || saving}
                  className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {saving ? '...' : 'Inplannen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </SmartCard>
    </div>
  );
}

function CallCenterContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialLeadId = searchParams.get('lead');
  
  // Persist call state across tab changes
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  
  // Call state - PERSISTED across tab switches
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState('');
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showQueueComplete, setShowQueueComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'callbacks' | 'search'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [callHistory, setCallHistory] = useState<CallLog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, []);

  // Restore call state if page refreshed during call
  useEffect(() => {
    const savedCallState = sessionStorage.getItem('callCenter_state');
    if (savedCallState) {
      const state = JSON.parse(savedCallState);
      if (state.isCalling) {
        setIsCalling(true);
        setCallDuration(state.callDuration || 0);
        setCallNotes(state.callNotes || '');
        if (state.currentLeadId) {
          // Will restore lead after fetch
        }
      }
    }
  }, []);

  // Save call state
  useEffect(() => {
    if (isCalling) {
      sessionStorage.setItem('callCenter_state', JSON.stringify({
        isCalling,
        callDuration,
        callNotes,
        currentLeadId: currentLead?.id
      }));
    } else {
      sessionStorage.removeItem('callCenter_state');
    }
  }, [isCalling, callDuration, callNotes, currentLead]);

  // Timer - only runs when isCalling is true, continues across tab switches
  useEffect(() => {
    if (isCalling) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCalling]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        const callableLeads = data.filter((l: any) => !l.doNotCall && l.status !== 'NOT_INTERESTED');
        setLeads(callableLeads);
        setFilteredLeads(callableLeads);
        
        // Restore lead if in call
        const savedState = sessionStorage.getItem('callCenter_state');
        if (savedState) {
          const state = JSON.parse(savedState);
          if (state.currentLeadId) {
            const lead = callableLeads.find((l: Lead) => l.id === state.currentLeadId);
            if (lead) setCurrentLead(lead);
          }
        } else if (initialLeadId) {
          const lead = callableLeads.find((l: Lead) => l.id === initialLeadId);
          if (lead) {
            setCurrentLead(lead);
            fetchCallHistory(lead.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCallHistory = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/calls`);
      if (response.ok) {
        const data = await response.json();
        setCallHistory(data.map((c: any) => ({
          id: c.id,
          date: c.calledAt,
          duration: c.duration ? `${Math.floor(c.duration / 60)}:${(c.duration % 60).toString().padStart(2, '0')}` : '0:00',
          outcome: c.result,
          notes: c.notes || '',
        })));
      }
    } catch (error) {
      console.error('Failed to fetch call history:', error);
    }
  };

  // Search leads
  useEffect(() => {
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      const results = leads.filter(l => 
        l.companyName?.toLowerCase().includes(query) ||
        l.contactName?.toLowerCase().includes(query) ||
        l.city?.toLowerCase().includes(query) ||
        l.niche?.toLowerCase().includes(query) ||
        l.phone?.includes(query) ||
        l.email?.toLowerCase().includes(query)
      );
      setFilteredLeads(results);
    } else {
      setFilteredLeads(leads);
    }
  }, [searchQuery, leads]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Queue
  const startQueue = () => {
    if (leads.length === 0) return;
    setIsQueueRunning(true);
    setQueueIndex(0);
    setCurrentLead(leads[0]);
    fetchCallHistory(leads[0].id);
    setActiveTab('queue');
  };

  // Skip to next
  const skipToNext = () => {
    // Don't skip if in active call
    if (isCalling) return;
    
    if (queueIndex < leads.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      setCurrentLead(leads[nextIndex]);
      fetchCallHistory(leads[nextIndex].id);
      setCallDuration(0);
      setCallNotes('');
    } else {
      setShowQueueComplete(true);
      setIsQueueRunning(false);
      setCurrentLead(null);
    }
  };

  // Start call
  const handleStartCall = () => {
    setIsCalling(true);
    setCallDuration(0);
  };

  // End call
  const handleEndCall = () => {
    setIsCalling(false);
    setShowOutcomeModal(true);
  };

  // Save call outcome
  const handleSaveCall = async () => {
    if (!currentLead || !selectedOutcome) return;

    try {
      await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: currentLead.id,
          result: selectedOutcome,
          notes: callNotes,
          duration: callDuration,
        }),
      });

      if (selectedOutcome === 'DNCM') {
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentLead.id,
            doNotCall: true,
            status: 'NOT_INTERESTED'
          })
        });
        const updatedLeads = leads.filter(l => l.id !== currentLead.id);
        setLeads(updatedLeads);
        setFilteredLeads(updatedLeads);
      }

      fetchLeads();

      setShowOutcomeModal(false);
      setCallNotes('');
      setSelectedOutcome('');
      setCallDuration(0);

      if (isQueueRunning && selectedOutcome === 'NO_ANSWER') {
        setTimeout(skipToNext, 500);
      } else if (isQueueRunning) {
        skipToNext();
      } else {
        setCurrentLead(null);
      }
    } catch (error) {
      console.error('Failed to save call:', error);
    }
  };

  // Select lead - ONLY if not in active call
  const selectLead = (lead: Lead) => {
    if (isCalling) return; // Prevent switching during call
    setCurrentLead(lead);
    fetchCallHistory(lead.id);
    setIsQueueRunning(false);
  };

  const handleSaveLead = async () => {
    if (!currentLead || !editedLead) return;
    
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentLead.id,
          ...editedLead,
        }),
      });
      
      setIsEditing(false);
      fetchLeads();
      setCurrentLead({ ...currentLead, ...editedLead });
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const queueLeads = leads.filter(l => l.status === 'NEW');
  const callbackLeads = leads.filter(l => l.status === 'CONTACTED' || l.status === 'QUOTED');

  // Active call banner
  const ActiveCallBanner = () => {
    if (!isCalling || !currentLead) return null;
    
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-pulse">
        <Phone className="w-5 h-5 animate-bounce" />
        <div>
          <p className="font-semibold text-sm">Gesprek bezig met {currentLead.companyName}</p>
          <p className="text-lg font-bold font-mono">{formatDuration(callDuration)}</p>
        </div>
        <button 
          onClick={handleEndCall}
          className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ActiveCallBanner />
      
      <PageHeader
        title="Call Center"
        subtitle={isQueueRunning 
          ? `Queue: ${queueIndex + 1} van ${queueLeads.length} leads` 
          : currentLead 
            ? `${currentLead.companyName}`
            : 'Bel je leads en volg op'
        }
        icon={<Phone className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/leads" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
              <Building2 className="w-4 h-4" />
              Leads
            </Link>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Tabs */}
            <SmartCard className="p-2">
              <div className="flex gap-1">
                <button onClick={() => setActiveTab('queue')} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'queue' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Queue ({queueLeads.length})
                </button>
                <button onClick={() => setActiveTab('callbacks')} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'callbacks' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Follow-up ({callbackLeads.length})
                </button>
                <button onClick={() => setActiveTab('search')} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'search' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Zoeken
                </button>
              </div>
            </SmartCard>

            {/* Queue */}
            {activeTab === 'queue' && (
              <SmartCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Play className="w-5 h-5 text-orange-500" />
                    Auto Queue
                  </h3>
                  {!isQueueRunning ? (
                    <button onClick={startQueue} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:shadow-lg">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  ) : (
                    <button onClick={() => setIsQueueRunning(false)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200">
                      <Pause className="w-4 h-4" />
                      Pauze
                    </button>
                  )}
                </div>
                
                {isQueueRunning && (
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all" style={{ width: `${((queueIndex + 1) / queueLeads.length) * 100}%` }} />
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {queueLeads.map((lead, index) => (
                    <div 
                      key={lead.id} 
                      onClick={() => selectLead(lead)} 
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        currentLead?.id === lead.id 
                          ? 'bg-orange-50 border-2 border-orange-300' 
                          : isCalling 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'bg-gray-50 border border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-sm">{lead.companyName}</p>
                      <p className="text-xs text-gray-500">{lead.contactName || 'Geen contact'}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </SmartCard>
            )}

            {/* Search */}
            {activeTab === 'search' && (
              <SmartCard className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-500" />
                  Zoek Lead
                </h3>
                <input
                  type="text"
                  placeholder="Zoek op naam, bedrijf, stad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                  {filteredLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      onClick={() => selectLead(lead)} 
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        currentLead?.id === lead.id 
                          ? 'bg-orange-50 border-2 border-orange-300' 
                          : isCalling 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'bg-gray-50 border border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-sm">{lead.companyName}</p>
                      <p className="text-xs text-gray-500">{lead.city || 'Geen stad'}</p>
                    </div>
                  ))}
                </div>
              </SmartCard>
            )}

            {/* Call History */}
            {currentLead && (
              <SmartCard>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-500" />
                    Gespreksgeschiedenis
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {callHistory.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">Nog geen gesprekken</p>
                  ) : (
                    callHistory.slice(0, 5).map((call) => {
                      const outcome = callOutcomes.find(o => o.value === call.outcome);
                      const OutcomeIcon = outcome?.icon || Phone;
                      return (
                        <div key={call.id} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <OutcomeIcon className={`w-4 h-4 ${outcome?.color === 'green' ? 'text-green-600' : outcome?.color === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
                            <div>
                              <p className="font-medium text-sm text-gray-900">{outcome?.label || call.outcome}</p>
                              <p className="text-xs text-gray-500">{new Date(call.date).toLocaleDateString('nl-BE')}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </SmartCard>
            )}
          </div>

          {/* Right Column - Call Interface */}
          <div className="lg:col-span-2">
            {currentLead ? (
              <div className="space-y-6">
                {/* Lead Info */}
                <SmartCard className="overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{currentLead.companyName}</h2>
                          <p className="text-orange-100">{currentLead.contactName || 'Geen contactpersoon'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={() => setIsEditing(false)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                              <X className="w-5 h-5" />
                            </button>
                            <button onClick={handleSaveLead} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                              <Save className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => { setIsEditing(true); setEditedLead(currentLead); }} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                            <Edit2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={editedLead.companyName || ''} onChange={(e) => setEditedLead({...editedLead, companyName: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Bedrijfsnaam" />
                        <input type="text" value={editedLead.contactName || ''} onChange={(e) => setEditedLead({...editedLead, contactName: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Contactpersoon" />
                        <input type="text" value={editedLead.phone || ''} onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Telefoon" />
                        <input type="email" value={editedLead.email || ''} onChange={(e) => setEditedLead({...editedLead, email: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Email" />
                        <input type="text" value={editedLead.city || ''} onChange={(e) => setEditedLead({...editedLead, city: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Stad" />
                        <input type="text" value={editedLead.niche || ''} onChange={(e) => setEditedLead({...editedLead, niche: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Niche" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <a href={`tel:${currentLead.phone}`} className="text-lg font-medium text-gray-900 hover:text-orange-600">
                              {currentLead.phone}
                            </a>
                          </div>
                          {currentLead.email && (
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">{currentLead.email}</span>
                            </div>
                          )}
                          {currentLead.city && (
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">{currentLead.city}</span>
                            </div>
                          )}
                          {currentLead.niche && (
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">{currentLead.niche}</span>
                            </div>
                          )}
                        </div>

                        {currentLead.notes && (
                          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <p className="text-sm text-yellow-800"><strong>Notities:</strong> {currentLead.notes}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setShowAppointmentModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Calendar className="w-4 h-4" />
                        Afspraak Maken
                      </button>
                      <Link
                        href={`/calculator?lead=${currentLead.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100"
                      >
                        <FileText className="w-4 h-4" />
                        Prijs Berekenen
                      </Link>
                    </div>
                  </div>
                </SmartCard>

                {/* Call Interface */}
                <SmartCard className={`p-8 text-center transition-all duration-300 ${isCalling ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : ''}`}>
                  {!isCalling ? (
                    <>
                      <div onClick={handleStartCall} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 cursor-pointer hover:scale-105 transition-transform">
                        <Phone className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Klaar om te bellen?</h3>
                      <button onClick={handleStartCall} className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg rounded-xl font-medium">
                        Bel {currentLead.contactName || currentLead.companyName}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25 animate-pulse">
                        <PhoneOff className="w-14 h-14 text-white" />
                      </div>
                      <div className="text-6xl font-bold text-gray-900 mb-2 font-mono">{formatDuration(callDuration)}</div>
                      <p className="text-gray-500 mb-6 text-lg">Gesprek bezig...</p>
                      <button onClick={handleEndCall} className="px-8 py-4 text-white bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg rounded-xl font-medium">
                        Gesprek Beëindigen
                      </button>
                    </>
                  )}
                </SmartCard>

                {/* Call Notes - Always visible during call */}
                {(isCalling || callNotes) && (
                  <SmartCard className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Gespreksnotities</h3>
                    <textarea
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Noteer belangrijke punten..."
                      className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </SmartCard>
                )}
              </div>
            ) : (
              <SmartCard className="h-full flex items-center justify-center">
                <EmptyState
                  icon={<Phone className="w-16 h-16" />}
                  title="Geen lead geselecteerd"
                  description={showQueueComplete 
                    ? "Queue voltooid! Alle leads zijn gebeld."
                    : "Start de queue of selecteer een lead om te beginnen."
                  }
                  action={
                    <div className="flex gap-3">
                      <button onClick={startQueue} className="px-6 py-3 text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-medium flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Start Queue
                      </button>
                    </div>
                  }
                />
              </SmartCard>
            )}
          </div>
        </div>
      </main>

      {/* Outcome Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <SmartCard className="w-full max-w-lg">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Gesprek Resultaat</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {callOutcomes.map((outcome) => {
                  const OutcomeIcon = outcome.icon;
                  return (
                    <button
                      key={outcome.value}
                      onClick={() => setSelectedOutcome(outcome.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${selectedOutcome === outcome.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                    >
                      <OutcomeIcon className={`w-6 h-6 mb-2 ${outcome.color === 'green' ? 'text-green-600' : outcome.color === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
                      <p className="font-medium text-gray-900">{outcome.label}</p>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowOutcomeModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl">
                  Annuleren
                </button>
                <button onClick={handleSaveCall} disabled={!selectedOutcome} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-xl disabled:opacity-50">
                  Opslaan
                </button>
              </div>
            </div>
          </SmartCard>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        lead={showAppointmentModal ? currentLead : null}
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />
    </PageContainer>
  );
}

export default function CallCenterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CallCenterContent />
    </Suspense>
  );
}
