'use client';

import { useState } from 'react';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  StatCard, 
  ActionButton,
  EmptyState,
  Badge,
} from '@/components/design-system/page-container';
import { 
  Calendar, 
  Plus,
  Clock,
  MapPin,
  Video,
  Home,
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowLeft,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

// Mock data
const mockAppointments = [
  { 
    id: '1', 
    leadName: 'Tech Solutions BV',
    contactName: 'Jan Janssen',
    phone: '+32 471 23 45 67',
    email: 'jan@tech.nl',
    type: 'HOME',
    date: '2025-02-15',
    time: '14:00',
    address: 'Industrielaan 123, 2000 Antwerpen',
    status: 'CONFIRMED',
    notes: 'Bespreken fiber opties voor kantoor'
  },
  { 
    id: '2', 
    leadName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    phone: '+32 485 67 89 01',
    email: 'info@delekkernij.be',
    type: 'ONLINE',
    date: '2025-02-16',
    time: '10:30',
    address: null,
    status: 'PENDING',
    notes: 'Video call via Teams'
  },
  { 
    id: '3', 
    leadName: 'Constructie Groep',
    contactName: 'Peter Willems',
    phone: '+32 496 12 34 56',
    email: 'peter@constructie.be',
    type: 'OFFICE',
    date: '2025-02-18',
    time: '15:00',
    address: 'Ons kantoor - Brussel',
    status: 'CONFIRMED',
    notes: 'Offerte bespreking'
  },
];

const typeConfig = {
  HOME: { label: 'Huisbezoek', icon: Home, color: 'bg-orange-100 text-orange-700' },
  OFFICE: { label: 'Kantoor', icon: Building2, color: 'bg-blue-100 text-blue-700' },
  ONLINE: { label: 'Online', icon: Video, color: 'bg-purple-100 text-purple-700' },
};

const statusConfig = {
  CONFIRMED: { label: 'Bevestigd', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PENDING: { label: 'In afwachting', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  CANCELLED: { label: 'Geannuleerd', color: 'bg-red-100 text-red-700', icon: XCircle },
  COMPLETED: { label: 'Afgerond', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
};

const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const stats = {
    total: mockAppointments.length,
    today: 1,
    thisWeek: 3,
    confirmed: mockAppointments.filter(a => a.status === 'CONFIRMED').length,
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

  return (
    <PageContainer>
      <PageHeader
        title="Afspraken"
        subtitle="Beheer je meetings en huisbezoeken"
        icon={<Calendar className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </ActionButton>
            <ActionButton variant="primary" icon={<Plus className="w-4 h-4" />}>
              Nieuwe Afspraak
            </ActionButton>
          </div>
        }
        stats={[
          { label: 'Totaal', value: stats.total.toString() },
          { label: 'Vandaag', value: stats.today.toString() },
          { label: 'Deze Week', value: stats.thisWeek.toString() },
          { label: 'Bevestigd', value: stats.confirmed.toString() },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Vandaag"
            value={stats.today}
            icon={<Calendar className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            label="Deze Week"
            value={stats.thisWeek}
            icon={<Clock className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label="Bevestigd"
            value={stats.confirmed}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            label="Conversie"
            value="75%"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            trend="up"
            trendValue="+5%"
          />
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lijst
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Kalender
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {mockAppointments.map((appointment, index) => {
              const type = typeConfig[appointment.type as keyof typeof typeConfig];
              const status = statusConfig[appointment.status as keyof typeof statusConfig];
              const TypeIcon = type.icon;
              const StatusIcon = status.icon;
              
              return (
                <SmartCard key={appointment.id}>
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Date & Time */}
                      <div className="flex items-center gap-4 md:w-48">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-medium">
                            {new Date(appointment.date).toLocaleDateString('nl-BE', { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold">
                            {new Date(appointment.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{appointment.time}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString('nl-BE', { weekday: 'long' })}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{appointment.leadName}</h3>
                          <Badge variant={
                            appointment.status === 'CONFIRMED' ? 'success' :
                            appointment.status === 'PENDING' ? 'warning' :
                            appointment.status === 'CANCELLED' ? 'error' : 'info'
                          }>
                            <span className="flex items-center gap-1">
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{appointment.contactName}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${type.color}`}>
                            <TypeIcon className="w-4 h-4" />
                            {type.label}
                          </span>
                          {appointment.address && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {appointment.address}
                            </span>
                          )}
                        </div>
                        
                        {appointment.notes && (
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {appointment.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 relative">
                        <button 
                          onClick={() => window.location.href = `tel:${appointment.phone || ''}`}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => window.location.href = `mailto:${appointment.email || ''}`}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenuIndex === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                              <button 
                                onClick={() => { alert('Bewerken - in ontwikkeling'); setOpenMenuIndex(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <span>✏️</span> Bewerken
                              </button>
                              <button 
                                onClick={() => { alert('Verwijderen - in ontwikkeling'); setOpenMenuIndex(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <span>🗑️</span> Verwijderen
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SmartCard>
              );
            })}
          </div>
        ) : (
          /* Calendar View */
          <SmartCard className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  Vandaag
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: getFirstDayOfMonth(currentDate) - 1 }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                const day = i + 1;
                const hasAppointment = mockAppointments.some(a => 
                  new Date(a.date).getDate() === day &&
                  new Date(a.date).getMonth() === currentDate.getMonth()
                );
                const isToday = new Date().getDate() === day && 
                  new Date().getMonth() === currentDate.getMonth();
                
                return (
                  <button
                    key={day}
                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isToday 
                        ? 'border-orange-500 bg-orange-50' 
                        : hasAppointment
                        ? 'border-blue-300 bg-blue-50 hover:border-blue-400'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-lg font-semibold ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {hasAppointment && (
                      <div className="flex gap-1 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </SmartCard>
        )}
      </main>
    </PageContainer>
  );
}
