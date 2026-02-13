'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Phone, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Mic,
  MicOff,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Target,
  TrendingUp,
  User,
  MapPin,
  Search,
  Filter,
  Edit3,
  FileText,
  Plus,
  Save,
  X,
  MessageSquare,
  History,
  Briefcase,
  ChevronDown,
  Star,
  ArrowRight,
  Loader2,
  Building2,
  Mail,
  Hash,
  MoreHorizontal,
  PhoneCall,
  Voicemail,
  ThumbsUp,
  ThumbsDown,
  CalendarCheck
} from 'lucide-react';
import Link from 'next/link';

// Extended mock queue with more data
const MOCK_QUEUE = [
  {
    id: '1',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    phone: '0472 12 34 56',
    email: 'maria@bakkerij.be',
    city: 'Aalst',
    province: 'Oost-Vlaanderen',
    priority: 'HIGH',
    status: 'NEW',
    lastContact: '2 dagen geleden',
    reason: 'Follow-up offerte',
    notes: [],
    callHistory: [
      { date: '2025-02-11', result: 'NO_ANSWER', notes: 'Niet opgenomen, voicemail ingesproken' },
    ]
  },
  {
    id: '2',
    companyName: 'Tech Solutions BV',
    contactName: 'Jan Janssen',
    phone: '0473 56 78 90',
    email: 'jan@techsolutions.be',
    city: 'Brussel',
    province: 'Brussel',
    priority: 'MEDIUM',
    status: 'CONTACTED',
    lastContact: '1 week geleden',
    reason: 'Nieuwe lead',
    notes: [
      { date: '2025-02-06', text: 'Geïnteresseerd in Internet + Mobile pack', author: 'Lenny' },
    ],
    callHistory: [
      { date: '2025-02-06', result: 'INTERESTED', notes: 'Wil offerte ontvangen' },
    ]
  },
  {
    id: '3',
    companyName: 'Constructie Groep',
    contactName: 'Peter Willems',
    phone: '0475 11 22 33',
    email: 'peter@constructie.be',
    city: 'Gent',
    province: 'Oost-Vlaanderen',
    priority: 'LOW',
    status: 'FOLLOW_UP',
    lastContact: '3 dagen geleden',
    reason: 'Terugbelverzoek',
    notes: [],
    callHistory: []
  },
  {
    id: '4',
    companyName: 'NecmiCuts',
    contactName: 'Necmi Yildiz',
    phone: '0472 98 76 54',
    email: 'necmi@necmicuts.be',
    city: 'Aalst',
    province: 'Oost-Vlaanderen',
    priority: 'HIGH',
    status: 'OFFER_SENT',
    lastContact: '3 dagen geleden',
    reason: 'Offerte follow-up',
    notes: [
      { date: '2025-02-10', text: 'Offerte verstuurd, wacht op reactie', author: 'Lenny' },
    ],
    callHistory: [
      { date: '2025-02-10', result: 'OFFER_SENT', notes: 'Offerte per mail verstuurd' },
    ]
  },
  {
    id: '5',
    companyName: 'Fashion Store',
    contactName: 'Lisa Dubois',
    phone: '0476 44 55 66',
    email: 'lisa@fashion.be',
    city: 'Antwerpen',
    province: 'Antwerpen',
    priority: 'MEDIUM',
    status: 'NEW',
    lastContact: 'Nog niet',
    reason: 'Nieuwe lead',
    notes: [],
    callHistory: []
  },
  {
    id: '6',
    companyName: 'Dental Care Plus',
    contactName: 'Dr. Sarah Vans',
    phone: '0471 23 45 67',
    email: 'sarah@dentalcare.be',
    city: 'Leuven',
    province: 'Vlaams-Brabant',
    priority: 'LOW',
    status: 'CONTACTED',
    lastContact: '5 dagen geleden',
    reason: 'Informatie aanvraag',
    notes: [],
    callHistory: [
      { date: '2025-02-08', result: 'CALLBACK_LATER', notes: 'Wil teruggebeld worden volgende week' },
    ]
  },
];

const CALL_RESULTS = [
  { value: 'INTERESTED', label: 'Geïnteresseerd', color: 'bg-green-500', icon: ThumbsUp },
  { value: 'NOT_INTERESTED', label: 'Niet Geïnteresseerd', color: 'bg-red-500', icon: ThumbsDown },
  { value: 'NO_ANSWER', label: 'Niet Opgenomen', color: 'bg-gray-500', icon: PhoneCall },
  { value: 'CALLBACK_LATER', label: 'Terugbelverzoek', color: 'bg-yellow-500', icon: Clock },
  { value: 'OFFER_SENT', label: 'Offerte Verstuurd', color: 'bg-blue-500', icon: FileText },
  { value: 'APPOINTMENT', label: 'Afspraak Gemaakt', color: 'bg-purple-500', icon: CalendarCheck },
  { value: 'VOICEMAIL', label: 'Voicemail', color: 'bg-orange-500', icon: Voicemail },
];

const PROVINCES = ['Alle', 'Antwerpen', 'Brussel', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'West-Vlaanderen', 'Limburg'];
const PRIORITIES = ['Alle', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['Alle', 'NEW', 'CONTACTED', 'OFFER_SENT', 'FOLLOW_UP', 'CONVERTED'];

export default function CallCenterPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [currentLead, setCurrentLead] = useState(MOCK_QUEUE[0]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState(MOCK_QUEUE);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('Alle');
  const [priorityFilter, setPriorityFilter] = useState('Alle');
  const [statusFilter, setStatusFilter] = useState('Alle');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCallResultModal, setShowCallResultModal] = useState(false);
  
  // Form states
  const [editingLead, setEditingLead] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [callResult, setCallResult] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [activeTab, setActiveTab] = useState('INFO');

  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter queue
  const filteredQueue = queue.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesCity = cityFilter === '' || lead.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesProvince = provinceFilter === 'Alle' || lead.province === provinceFilter;
    const matchesPriority = priorityFilter === 'Alle' || lead.priority === priorityFilter;
    const matchesStatus = statusFilter === 'Alle' || lead.status === statusFilter;
    return matchesSearch && matchesCity && matchesProvince && matchesPriority && matchesStatus;
  });

  const nextLead = () => {
    const currentIndex = filteredQueue.findIndex(l => l.id === currentLead.id);
    const nextIndex = (currentIndex + 1) % filteredQueue.length;
    setCurrentLead(filteredQueue[nextIndex]);
    setCallDuration(0);
  };

  const saveLeadEdit = () => {
    setQueue(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
    setCurrentLead(editingLead);
    setShowEditModal(false);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      date: new Date().toISOString().split('T')[0],
      text: newNote,
      author: 'Lenny'
    };
    setQueue(prev => prev.map(l => 
      l.id === currentLead.id 
        ? { ...l, notes: [...l.notes, note] }
        : l
    ));
    setCurrentLead(prev => ({ ...prev, notes: [...prev.notes, note] }));
    setNewNote('');
    setShowNoteModal(false);
  };

  const saveCallResult = () => {
    if (!callResult) return;
    const result = {
      date: new Date().toISOString().split('T')[0],
      result: callResult,
      notes: callNotes
    };
    setQueue(prev => prev.map(l => 
      l.id === currentLead.id 
        ? { ...l, callHistory: [result, ...l.callHistory] }
        : l
    ));
    setCurrentLead(prev => ({ ...prev, callHistory: [result, ...prev.callHistory] }));
    setCallResult('');
    setCallNotes('');
    setShowCallResultModal(false);
    setIsCalling(false);
  };

  const getResultLabel = (result: string) => {
    return CALL_RESULTS.find(r => r.value === result)?.label || result;
  };

  const stats = {
    total: queue.length,
    called: queue.filter(l => l.callHistory.length > 0).length,
    interested: queue.filter(l => l.callHistory.some(h => h.result === 'INTERESTED')).length,
    offers: queue.filter(l => l.callHistory.some(h => h.result === 'OFFER_SENT')).length,
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Edit Lead Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Lead Bewerken</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={editingLead.companyName}
                  onChange={(e) => setEditingLead({...editingLead, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon</label>
                <input
                  type="text"
                  value={editingLead.contactName}
                  onChange={(e) => setEditingLead({...editingLead, contactName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stad</label>
                  <input
                    type="text"
                    value={editingLead.city}
                    onChange={(e) => setEditingLead({...editingLead, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provincie</label>
                  <select
                    value={editingLead.province}
                    onChange={(e) => setEditingLead({...editingLead, province: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {PROVINCES.filter(p => p !== 'Alle').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioriteit</label>
                <select
                  value={editingLead.priority}
                  onChange={(e) => setEditingLead({...editingLead, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Annuleren
              </button>
              <button
                onClick={saveLeadEdit}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Notitie Toevoegen</h2>
              <button onClick={() => setShowNoteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              placeholder="Schrijf je notitie hier..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Annuleren
              </button>
              <button
                onClick={addNote}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600"
              >
                Toevoegen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Result Modal */}
      {showCallResultModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Gespreksresultaat</h2>
              <button onClick={() => setShowCallResultModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {CALL_RESULTS.map((result) => (
                <button
                  key={result.value}
                  onClick={() => setCallResult(result.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    callResult === result.value 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <result.icon className={`w-5 h-5 mb-2 ${callResult === result.value ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${callResult === result.value ? 'text-orange-900' : 'text-gray-700'}`}>
                    {result.label}
                  </span>
                </button>
              ))}
            </div>
            <textarea
              placeholder="Extra notities over het gesprek..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowCallResultModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Annuleren
              </button>
              <button
                onClick={saveCallResult}
                disabled={!callResult}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50"
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Call Geschiedenis</h2>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {currentLead.callHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nog geen gesprekken</p>
              ) : (
                currentLead.callHistory.map((call: any, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{call.date}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {getResultLabel(call.result)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{call.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Center Pro</h1>
          <p className="text-gray-500 mt-1">Bel je leads en volg je voortgang</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Calls vandaag</p>
            <p className="text-2xl font-bold text-gray-900">{stats.called}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Queue</p>
            <p className="text-2xl font-bold text-orange-600">{filteredQueue.length}</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600">Totaal Leads</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600">Gebeld</p>
          <p className="text-2xl font-bold text-green-900">{stats.called}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-600">Interesse</p>
          <p className="text-2xl font-bold text-purple-900">{stats.interested}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <p className="text-sm text-orange-600">Offertes</p>
          <p className="text-2xl font-bold text-orange-900">{stats.offers}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op bedrijf, contact of telefoon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              showFilters ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stad</label>
              <input
                type="text"
                placeholder="Filter op stad..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provincie</label>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioriteit</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Call / Current Lead */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            {isCalling ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Gesprek bezig</h2>
                <p className="text-4xl font-mono mb-6">{formatTime(callDuration)}</p>
                
                <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
                  <h3 className="text-xl font-bold mb-1">{currentLead.companyName}</h3>
                  <p className="text-gray-300 mb-3">{currentLead.contactName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {currentLead.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {currentLead.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                      isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button 
                    onClick={() => setShowCallResultModal(true)}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Phone className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Volgende Lead</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentLead.priority === 'HIGH' ? 'bg-red-500' :
                      currentLead.priority === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      {currentLead.priority}
                    </span>
                    <button
                      onClick={() => { setEditingLead({...currentLead}); setShowEditModal(true); }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Bewerken"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-5 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                      {currentLead.companyName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{currentLead.companyName}</h3>
                      <p className="text-gray-300 mb-3">{currentLead.contactName}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {currentLead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {currentLead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {currentLead.city}, {currentLead.province}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {currentLead.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex gap-2 mt-4 border-b border-white/10">
                    {['INFO', 'NOTITIES', 'HISTORY'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab 
                            ? 'text-orange-400 border-b-2 border-orange-400' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab === 'INFO' && 'Info'}
                        {tab === 'NOTITIES' && `Notities (${currentLead.notes.length})`}
                        {tab === 'HISTORY' && `Geschiedenis (${currentLead.callHistory.length})`}
                      </button>
                    ))}
                  </div>
                  
                  {/* Tab Content */}
                  <div className="mt-4 min-h-[120px]">
                    {activeTab === 'INFO' && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">📝 {currentLead.reason}</p>
                        <p className="text-sm text-gray-400">Laatste contact: {currentLead.lastContact}</p>
                      </div>
                    )}
                    {activeTab === 'NOTITIES' && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {currentLead.notes.length === 0 ? (
                          <p className="text-sm text-gray-400 italic">Geen notities</p>
                        ) : (
                          currentLead.notes.map((note: any, idx: number) => (
                            <div key={idx} className="p-2 bg-white/5 rounded-lg">
                              <p className="text-sm text-gray-300">{note.text}</p>
                              <p className="text-xs text-gray-500">{note.date} door {note.author}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    {activeTab === 'HISTORY' && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {currentLead.callHistory.length === 0 ? (
                          <p className="text-sm text-gray-400 italic">Geen gesprekken</p>
                        ) : (
                          currentLead.callHistory.map((call: any, idx: number) => (
                            <div key={idx} className="p-2 bg-white/5 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{call.date}</span>
                                <span className="text-xs text-orange-400">{getResultLabel(call.result)}</span>
                              </div>
                              <p className="text-sm text-gray-300">{call.notes}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  <a
                    href={`tel:${currentLead.phone}`}
                    onClick={() => setIsCalling(true)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Bel Nu
                  </a>
                  <button 
                    onClick={() => setShowNoteModal(true)}
                    className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Notitie
                  </button>
                  <a 
                    href={`/calculator?lead=${currentLead.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl font-medium transition-all shadow-lg"
                  >
                    <FileText className="w-4 h-4" />
                    Offerte Maken
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Queue */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Wachtrij ({filteredQueue.length})</h2>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Geschiedenis
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredQueue.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => { setCurrentLead(lead); setIsCalling(false); }}
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    currentLead.id === lead.id 
                      ? 'bg-orange-50 border-2 border-orange-200' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{lead.companyName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      lead.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      lead.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {lead.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{lead.contactName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {lead.city}
                    </span>
                    {lead.callHistory.length > 0 && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" />
                        {lead.callHistory.length}x gebeld
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
