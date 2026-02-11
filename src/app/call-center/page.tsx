'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  ActionButton,
  EmptyState,
  Badge,
  SearchInput,
} from '@/components/design-system/page-container';
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
  Plus,
  Target,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  AlertCircle,
  Clock3,
  Search,
  User,
  Briefcase,
  TrendingUp,
  Check,
  X
} from 'lucide-react';

// Types
interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  currentProvider: string;
  currentMonthlyCost: number;
  contractEndDate: string;
  status: 'NEW' | 'CALLBACK' | 'CONTACTED' | 'QUOTED' | 'SALE_MADE' | 'NOT_INTERESTED';
  notes: string;
  lastCallDate?: string;
  callAttempts: number;
  callbackDate?: string;
  callbackTime?: string;
  priority: number;
}

interface CallLog {
  id: string;
  date: string;
  duration: string;
  outcome: 'INTERESTED' | 'NOT_INTERESTED' | 'CALLBACK' | 'NO_ANSWER' | 'QUOTED' | 'SALE' | 'DNCM';
  notes: string;
}

// Mock queue data
const mockQueue: Lead[] = [
  { 
    id: '1', 
    companyName: 'Tech Solutions BV', 
    contactName: 'Jan Janssen', 
    email: 'jan@tech.nl', 
    phone: '+32 471 23 45 67', 
    address: 'Industrielaan 123',
    city: 'Antwerpen', 
    postalCode: '2000',
    currentProvider: 'Proximus',
    currentMonthlyCost: 250,
    contractEndDate: '2025-06-15',
    status: 'NEW', 
    notes: 'Geïnteresseerd in fiber, contract loopt af in juni',
    callAttempts: 0,
    priority: 1,
  },
  { 
    id: '2', 
    companyName: 'Bakkerij De Lekkernij', 
    contactName: 'Maria Peeters', 
    email: 'info@delekkernij.be', 
    phone: '+32 485 67 89 01', 
    address: 'Stationsstraat 45',
    city: 'Brussel', 
    postalCode: '1000',
    currentProvider: 'Telenet',
    currentMonthlyCost: 180,
    contractEndDate: '2025-04-20',
    status: 'CALLBACK', 
    notes: 'Terugbellen na 14:00',
    callAttempts: 1,
    callbackDate: '2025-02-10',
    callbackTime: '14:00',
    priority: 2,
  },
  { 
    id: '3', 
    companyName: 'Constructie Groep', 
    contactName: 'Peter Willems', 
    email: 'peter@constructie.be', 
    phone: '+32 496 12 34 56', 
    address: 'Boulevard Industriel 78',
    city: 'Gent', 
    postalCode: '9000',
    currentProvider: 'Orange',
    currentMonthlyCost: 320,
    contractEndDate: '2025-08-30',
    status: 'NEW', 
    notes: 'Groot bedrijf, meerdere locaties',
    callAttempts: 0,
    priority: 1,
  },
  { 
    id: '4', 
    companyName: 'Fashion Store', 
    contactName: 'Lisa Dubois', 
    email: 'lisa@fashion.be', 
    phone: '+32 477 88 99 00', 
    address: 'Rue de la Mode 12',
    city: 'Luik', 
    postalCode: '4000',
    currentProvider: 'Proximus',
    currentMonthlyCost: 150,
    contractEndDate: '2025-05-10',
    status: 'CONTACTED', 
    notes: 'Wil offerte voor winkelketen',
    lastCallDate: '2025-02-08',
    callAttempts: 2,
    priority: 3,
  },
];

const mockCallbacks: Lead[] = [
  {
    id: '5',
    companyName: 'Auto Garage Fast',
    contactName: 'Tom Vermeer',
    email: 'tom@fastgarage.be',
    phone: '+32 468 11 22 33',
    address: 'Garagestraat 8',
    city: 'Hasselt',
    postalCode: '3500',
    currentProvider: 'Telenet',
    currentMonthlyCost: 200,
    contractEndDate: '2025-07-15',
    status: 'CALLBACK',
    notes: 'Wil bespreken na weekend',
    callAttempts: 1,
    callbackDate: '2025-02-10',
    callbackTime: '10:00',
    priority: 2,
  },
];

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

function CallCenterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialLeadId = searchParams.get('lead');
  
  // State
  const [queue, setQueue] = useState<Lead[]>(mockQueue);
  const [callbacks, setCallbacks] = useState<Lead[]>(mockCallbacks);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showQueueComplete, setShowQueueComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'callbacks' | 'search'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [callHistory, setCallHistory] = useState<CallLog[]>([
    { id: '1', date: '2025-02-08', duration: '5:32', outcome: 'INTERESTED', notes: 'Klant geïnteresseerd in offerte' },
    { id: '2', date: '2025-02-05', duration: '3:15', outcome: 'NO_ANSWER', notes: 'Niemand opgenomen' },
  ]);

  // Initialize with lead from URL or start queue
  useEffect(() => {
    if (initialLeadId) {
      const lead = [...queue, ...callbacks].find(l => l.id === initialLeadId);
      if (lead) {
        setCurrentLead(lead);
        setIsQueueRunning(false);
      }
    }
  }, [initialLeadId, queue, callbacks]);

  // Timer voor gespreksduur
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Queue
  const startQueue = () => {
    if (queue.length === 0) return;
    setIsQueueRunning(true);
    setQueueIndex(0);
    setCurrentLead(queue[0]);
    setActiveTab('queue');
  };

  // Pause Queue
  const pauseQueue = () => {
    setIsQueueRunning(false);
  };

  // Skip to next in queue
  const skipToNext = () => {
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      setCurrentLead(queue[nextIndex]);
      setCallDuration(0);
      setCallNotes('');
    } else {
      // Queue complete
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

    // Handle DNCM (Do Not Call Me) - GDPR compliance
    if (selectedOutcome === 'DNCM') {
      try {
        // Update lead in database
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentLead.id,
            doNotCall: true,
            status: 'DNCM'
          })
        });
      } catch (error) {
        console.error('Failed to update lead DNCM status:', error);
      }
      
      // Remove from queue and mark as doNotCall
      const updatedQueue = queue.filter(l => l.id !== currentLead.id);
      setQueue(updatedQueue);
      
      // Add to call history with special note
      const newCall: CallLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: formatDuration(callDuration),
        outcome: 'DNCM',
        notes: `DNCM - Klant wil niet gebeld worden. ${callNotes}`,
      };
      setCallHistory([newCall, ...callHistory]);
      
      setShowOutcomeModal(false);
      
      // If in queue mode, go to next
      if (isQueueRunning) {
        setTimeout(() => {
          if (queueIndex < updatedQueue.length) {
            setCurrentLead(updatedQueue[queueIndex]);
          } else {
            setShowQueueComplete(true);
            setIsQueueRunning(false);
            setCurrentLead(null);
          }
        }, 500);
      } else {
        setCurrentLead(null);
      }
      
      // Reset
      setCallNotes('');
      setSelectedOutcome('');
      setCallDuration(0);
      return;
    }

    // Add to call history
    const newCall: CallLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: formatDuration(callDuration),
      outcome: selectedOutcome as CallLog['outcome'],
      notes: callNotes,
    };
    setCallHistory([newCall, ...callHistory]);

    // Update lead status
    const updatedQueue = queue.map(l => 
      l.id === currentLead.id 
        ? { ...l, callAttempts: l.callAttempts + 1, lastCallDate: new Date().toISOString() }
        : l
    );
    setQueue(updatedQueue);

    // Handle outcome
    if (selectedOutcome === 'APPOINTMENT') {
      // Redirect to appointments page to schedule
      setShowOutcomeModal(false);
      router.push('/appointments');
      return;
    } else if (selectedOutcome === 'NO_ANSWER' && isQueueRunning) {
      // Auto advance to next after no answer
      setShowOutcomeModal(false);
      setTimeout(() => {
        skipToNext();
      }, 1500);
    } else if (isQueueRunning) {
      // Ask to continue queue
      setShowOutcomeModal(false);
      skipToNext();
    } else {
      setShowOutcomeModal(false);
    }

    // Reset
    setCallNotes('');
    setSelectedOutcome('');
    setCallDuration(0);
  };

  // Select lead from callbacks
  const selectCallback = (lead: Lead) => {
    setCurrentLead(lead);
    setIsQueueRunning(false);
    setActiveTab('callbacks');
  };

  // Search for lead
  const searchLead = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const allLeads = [...queue, ...callbacks];
      const results = allLeads.filter(l => 
        l.companyName.toLowerCase().includes(query.toLowerCase()) ||
        l.contactName.toLowerCase().includes(query.toLowerCase()) ||
        l.phone.includes(query)
      );
      if (results.length === 1) {
        setCurrentLead(results[0]);
        setIsQueueRunning(false);
      }
    }
  };

  // Filtered leads for search
  const searchResults = searchQuery.length > 2 
    ? [...queue, ...callbacks].filter(l => 
        l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery)
      )
    : [];

  return (
    <PageContainer>
      <PageHeader
        title="Call Center"
        subtitle={isQueueRunning 
          ? `Queue: ${queueIndex + 1} van ${queue.length} leads` 
          : currentLead 
            ? `${currentLead.companyName} - ${currentLead.contactName}`
            : 'Bel je leads en volg op'
        }
        icon={<Phone className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/leads"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              <Building2 className="w-4 h-4" />
              Leads
            </Link>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Queue / Callbacks / Search */}
          <div className="space-y-4">
            {/* Tabs */}
            <SmartCard className="p-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'queue'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Queue ({queue.length})
                </button>
                <button
                  onClick={() => setActiveTab('callbacks')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'callbacks'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Callbacks ({callbacks.length})
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'search'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Zoeken
                </button>
              </div>
            </SmartCard>

            {/* Queue Controls */}
            {activeTab === 'queue' && (
              <SmartCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Play className="w-5 h-5 text-orange-500" />
                    Auto Queue
                  </h3>
                  {isQueueRunning ? (
                    <button
                      onClick={pauseQueue}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200"
                    >
                      <Pause className="w-4 h-4" />
                      Pauze
                    </button>
                  ) : (
                    <button
                      onClick={startQueue}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      Start Queue
                    </button>
                  )}
                </div>
                
                {isQueueRunning && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Voortgang</span>
                      <span className="font-medium">{queueIndex + 1} / {queue.length}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all"
                        style={{ width: `${((queueIndex + 1) / queue.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {queue.map((lead, index) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setCurrentLead(lead);
                        setQueueIndex(index);
                        setIsQueueRunning(false);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        currentLead?.id === lead.id
                          ? 'bg-orange-50 border-2 border-orange-300'
                          : index < queueIndex
                          ? 'bg-green-50 border border-green-200 opacity-60'
                          : 'bg-gray-50 border border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{lead.companyName}</p>
                          <p className="text-xs text-gray-500">{lead.contactName}</p>
                        </div>
                        {index < queueIndex && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {lead.status === 'CALLBACK' && (
                          <Badge variant="info" className="text-xs">
                            <Clock3 className="w-3 h-3 mr-1" />
                            {lead.callbackTime}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                        {lead.callAttempts > 0 && (
                          <span className="text-orange-600">
                            • {lead.callAttempts}x geprobeerd
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SmartCard>
            )}

            {/* Callbacks List */}
            {activeTab === 'callbacks' && (
              <SmartCard className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Terugbellen
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {callbacks.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => selectCallback(lead)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        currentLead?.id === lead.id
                          ? 'bg-blue-50 border-2 border-blue-300'
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 text-sm">{lead.companyName}</p>
                        <Badge variant="info" className="text-xs">
                          {lead.callbackTime}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{lead.contactName}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {lead.callbackDate}
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
                  Lead Zoeken
                </h3>
                <SearchInput
                  placeholder="Zoek op naam, bedrijf of telefoon..."
                  value={searchQuery}
                  onChange={searchLead}
                />
                <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                  {searchResults.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setCurrentLead(lead);
                        setIsQueueRunning(false);
                      }}
                      className="p-3 rounded-xl cursor-pointer bg-gray-50 border border-gray-200 hover:border-purple-300"
                    >
                      <p className="font-medium text-gray-900 text-sm">{lead.companyName}</p>
                      <p className="text-xs text-gray-500">{lead.contactName}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </div>
                  ))}
                </div>
              </SmartCard>
            )}

            {/* Call History */}
            <SmartCard>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-500" />
                  Gespreksgeschiedenis
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {callHistory.slice(0, 5).map((call) => {
                  const outcome = callOutcomes.find(o => o.value === call.outcome);
                  const OutcomeIcon = outcome?.icon || Phone;
                  
                  return (
                    <div key={call.id} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            outcome?.color === 'green' ? 'bg-green-100 text-green-600' :
                            outcome?.color === 'red' ? 'bg-red-100 text-red-600' :
                            outcome?.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            outcome?.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            outcome?.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <OutcomeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{outcome?.label}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(call.date).toLocaleDateString('nl-BE')} • {call.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SmartCard>
          </div>

          {/* Right Column - Call Interface */}
          <div className="lg:col-span-2">
            {currentLead ? (
              <div className="space-y-6">
                {/* Lead Info Card */}
                <SmartCard className="overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{currentLead.companyName}</h2>
                          <p className="text-orange-100">{currentLead.contactName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isQueueRunning && (
                          <Badge className="bg-white/20 text-white border-0">
                            Queue #{queueIndex + 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${currentLead.phone}`} className="text-lg font-medium text-gray-900 hover:text-orange-600">
                          {currentLead.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{currentLead.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {currentLead.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {currentLead.currentProvider} • €{currentLead.currentMonthlyCost}/maand
                        </span>
                      </div>
                    </div>

                    {currentLead.notes && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <p className="text-sm text-yellow-800">
                          <strong>Notities:</strong> {currentLead.notes}
                        </p>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <Link
                        href={`/offers?lead=${currentLead.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100"
                      >
                        <FileText className="w-4 h-4" />
                        Offerte Maken
                      </Link>
                      <Link
                        href={`/appointments?lead=${currentLead.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Calendar className="w-4 h-4" />
                        Afspraak Inplannen
                      </Link>
                    </div>
                  </div>
                </SmartCard>

                {/* Call Interface */}
                <SmartCard className={`p-8 text-center transition-all duration-300 ${
                  isCalling ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : ''
                }`}>
                  {!isCalling ? (
                    <>
                      <div 
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 cursor-pointer hover:scale-105 transition-transform"
                        onClick={handleStartCall}
                      >
                        <Phone className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {isQueueRunning ? 'Volgende Lead Bellen' : 'Klaar om te bellen?'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {isQueueRunning 
                          ? 'Klik op de groene knop om het gesprek te starten'
                          : 'Klik op de groene knop om te beginnen'
                        }
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button 
                          onClick={handleStartCall}
                          className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg rounded-xl font-medium flex items-center gap-2"
                        >
                          <Phone className="w-5 h-5" />
                          Bel {currentLead.contactName}
                        </button>
                        {isQueueRunning && (
                          <button 
                            onClick={skipToNext}
                            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium flex items-center gap-2"
                          >
                            <SkipForward className="w-5 h-5" />
                            Overslaan
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div 
                        className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25 animate-pulse cursor-pointer hover:scale-105 transition-transform"
                        onClick={handleEndCall}
                      >
                        <PhoneOff className="w-14 h-14 text-white" />
                      </div>
                      <div className="text-6xl font-bold text-gray-900 mb-2 font-mono">
                        {formatDuration(callDuration)}
                      </div>
                      <p className="text-gray-500 mb-6 text-lg">Gesprek bezig...</p>
                      <div className="flex gap-3 justify-center">
                        <button 
                          onClick={handleEndCall}
                          className="px-8 py-4 text-white bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg rounded-xl font-medium flex items-center gap-2"
                        >
                          <PhoneOff className="w-5 h-5" />
                          Gesprek Beëindigen
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedOutcome('DNCM');
                            setShowOutcomeModal(true);
                          }}
                          className="px-6 py-4 text-rose-700 bg-rose-100 hover:bg-rose-200 border-2 border-rose-300 rounded-xl font-medium flex items-center gap-2"
                          title="Klant wil niet gebeld worden (GDPR)"
                        >
                          <PhoneOff className="w-5 h-5" />
                          DNCM Afboeken
                        </button>
                      </div>
                    </>
                  )}
                </SmartCard>

                {/* Call Notes */}
                {isCalling && (
                  <SmartCard className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-500" />
                      Gespreksnotities
                    </h3>
                    <textarea
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Noteer hier belangrijke punten uit het gesprek..."
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
                      <button 
                        onClick={startQueue}
                        className="px-6 py-3 text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-medium flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Start Queue
                      </button>
                      <button 
                        onClick={() => setActiveTab('callbacks')}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium flex items-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        Callbacks
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <SmartCard className="w-full max-w-lg">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gesprek Resultaat</h3>
              <p className="text-gray-500 mb-6">
                {isQueueRunning 
                  ? 'Selecteer het resultaat. Bij "Geen Antwoord" gaat de queue automatisch verder.'
                  : 'Selecteer het resultaat van dit gesprek'
                }
              </p>
              
              {/* Quick DNCM Warning - Show if DNCM selected */}
              {selectedOutcome === 'DNCM' && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-rose-800 font-medium flex items-center gap-2">
                    <PhoneOff className="w-5 h-5" />
                    Waarschuwing: DNCM (Do Not Call Me)
                  </p>
                  <p className="text-sm text-rose-600 mt-1">
                    Deze lead wordt definitief verwijderd uit de wachtrij en gemarkeerd als "Niet Bellen". 
                    Dit is nodig voor GDPR/telecomwet compliance.
                  </p>
                </div>
              )}
              
              {/* Quick DNCM Button - Always visible at top */}
              <button
                onClick={() => setSelectedOutcome('DNCM')}
                className={`w-full mb-4 p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  selectedOutcome === 'DNCM'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-rose-200 bg-rose-50/50 hover:border-rose-400 hover:bg-rose-100'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <PhoneOff className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="font-semibold text-rose-800">DNCM Afboeken</p>
                  <p className="text-sm text-rose-600">Klant wil niet gebeld worden (GDPR)</p>
                </div>
              </button>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {callOutcomes.map((outcome) => {
                  const OutcomeIcon = outcome.icon;
                  return (
                    <button
                      key={outcome.value}
                      onClick={() => setSelectedOutcome(outcome.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedOutcome === outcome.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <OutcomeIcon className={`w-6 h-6 mb-2 ${
                        outcome.color === 'green' ? 'text-green-600' :
                        outcome.color === 'red' ? 'text-red-600' :
                        outcome.color === 'blue' ? 'text-blue-600' :
                        outcome.color === 'purple' ? 'text-purple-600' :
                        outcome.color === 'orange' ? 'text-orange-600' :
                        outcome.color === 'rose' ? 'text-rose-600' :
                        'text-gray-600'
                      }`} />
                      <p className="font-medium text-gray-900">{outcome.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowOutcomeModal(false)} 
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Annuleren
                </button>
                <button 
                  onClick={handleSaveCall} 
                  className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-50 ${
                    selectedOutcome === 'DNCM'
                      ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg'
                  }`}
                  disabled={!selectedOutcome}
                >
                  {selectedOutcome === 'DNCM'
                    ? 'DNCM Afboeken'
                    : isQueueRunning && selectedOutcome === 'NO_ANSWER' 
                      ? 'Opslaan & Volgende'
                      : 'Opslaan'
                  }
                </button>
              </div>
            </div>
          </SmartCard>
        </div>
      )}

      {/* Queue Complete Modal */}
      {showQueueComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <SmartCard className="w-full max-w-md text-center">
            <div className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Queue Voltooid!</h3>
              <p className="text-gray-500 mb-6">
                Je hebt alle {queue.length} leads in de wachtrij gebeld.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowQueueComplete(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Sluiten
                </button>
                <button 
                  onClick={() => {
                    setShowQueueComplete(false);
                    setActiveTab('callbacks');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-xl"
                >
                  Callbacks Bekijken
                </button>
              </div>
            </div>
          </SmartCard>
        </div>
      )}
    </PageContainer>
  );
}

// Loading fallback
function CallCenterLoading() {
  return (
    <PageContainer>
      <PageHeader
        title="Call Center"
        subtitle="Bel je leads en volg op"
        icon={<Phone className="w-6 h-6 text-white" />}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </main>
    </PageContainer>
  );
}

// Main export with Suspense
export default function CallCenterPage() {
  return (
    <Suspense fallback={<CallCenterLoading />}>
      <CallCenterContent />
    </Suspense>
  );
}
