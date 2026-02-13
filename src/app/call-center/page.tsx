'use client';

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
  MapPin
} from 'lucide-react';
import Link from 'next/link';

// Mock queue
const MOCK_QUEUE = [
  {
    id: '1',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    phone: '0472 12 34 56',
    city: 'Aalst',
    priority: 'HIGH',
    lastContact: '2 dagen geleden',
    reason: 'Follow-up offerte'
  },
  {
    id: '2',
    companyName: 'Tech Solutions BV',
    contactName: 'Jan Janssen',
    phone: '0473 56 78 90',
    city: 'Brussel',
    priority: 'MEDIUM',
    lastContact: '1 week geleden',
    reason: 'Nieuwe lead'
  },
  {
    id: '3',
    companyName: 'Constructie Groep',
    contactName: 'Peter Willems',
    phone: '0475 11 22 33',
    city: 'Gent',
    priority: 'LOW',
    lastContact: '3 dagen geleden',
    reason: 'Terugbelverzoek'
  }
];

export default function CallCenterPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [currentLead, setCurrentLead] = useState(MOCK_QUEUE[0]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState(MOCK_QUEUE);

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

  const nextLead = () => {
    const currentIndex = queue.findIndex(l => l.id === currentLead.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentLead(queue[nextIndex]);
    setCallDuration(0);
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-500 mt-1">Bel je leads en volg je voortgang</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Calls vandaag</p>
            <p className="text-2xl font-bold text-gray-900">15</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Doel</p>
            <p className="text-2xl font-bold text-gray-900">25</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Call / Current Lead */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            {isCalling ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Gesprek bezig</h2>
                <p className="text-4xl font-mono mb-6">{formatTime(callDuration)}</p>
                
                <div className="bg-white/10 rounded-xl p-6 mb-6 text-left">
                  <h3 className="text-xl font-bold mb-1">{currentLead.companyName}</h3>
                  <p className="text-gray-300 mb-4">{currentLead.contactName}</p>
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
                    onClick={() => setIsCalling(false)}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Phone className="w-8 h-8 rotate-135" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Volgende Lead</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentLead.priority === 'HIGH' ? 'bg-red-500' :
                    currentLead.priority === 'MEDIUM' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}>
                    {currentLead.priority}
                  </span>
                </div>

                <div className="bg-white/10 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                      {currentLead.companyName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{currentLead.companyName}</h3>
                      <p className="text-gray-300 mb-3">{currentLead.contactName}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {currentLead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {currentLead.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {currentLead.lastContact}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-sm text-gray-300">📝 {currentLead.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={`tel:${currentLead.phone}`}
                    onClick={() => setIsCalling(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Bel Nu
                  </a>
                  <button 
                    onClick={nextLead}
                    className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                    Volgende
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Queue */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Wachtrij ({queue.length})</h2>
            <div className="space-y-3">
              {queue.map((lead, idx) => (
                <button
                  key={lead.id}
                  onClick={() => { setCurrentLead(lead); setIsCalling(false); }}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    currentLead.id === lead.id 
                      ? 'bg-orange-50 border-2 border-orange-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{lead.companyName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      lead.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      lead.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {lead.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{lead.city}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
