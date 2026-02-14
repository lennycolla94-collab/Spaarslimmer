'use client';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Phone, 
  Video,
  User,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';

// Mock appointments
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    clientName: 'Maria Peeters',
    company: 'Bakkerij De Lekkernij',
    date: '2025-02-14',
    time: '14:00',
    type: 'PHYSICAL',
    location: 'Aalst',
    status: 'SCHEDULED',
    notes: '2e adres bespreken, upsell naar Giga internet'
  },
  {
    id: '2',
    clientName: 'Jan Janssen',
    company: 'Tech Solutions BV',
    date: '2025-02-14',
    time: '16:30',
    type: 'PHONE',
    location: 'Phone Call',
    status: 'SCHEDULED',
    notes: 'Offerte opvolging'
  },
  {
    id: '3',
    clientName: 'Necmi Yildiz',
    company: 'NecmiCuts',
    date: '2025-02-15',
    time: '10:00',
    type: 'PHYSICAL',
    location: 'Aalst',
    status: 'SCHEDULED',
    notes: 'Nieuwe klant, TV + Internet'
  },
  {
    id: '4',
    clientName: 'Lisa Dubois',
    company: 'Fashion Store',
    date: '2025-02-17',
    time: '11:00',
    type: 'VIDEO',
    location: 'Teams',
    status: 'SCHEDULED',
    notes: 'Mobile bundels bespreken'
  }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

  // Stats
  const todaysAppointments = appointments.filter(a => {
    const date = new Date(a.date);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
  });

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Totaal Afspraken</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Deze Maand</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {appointments.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Fysiek</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {appointments.filter(a => a.type === 'PHYSICAL').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Telefoon</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {appointments.filter(a => a.type === 'PHONE' || a.type === 'VIDEO').length}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Afspraken</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer je afspraken en meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
              Lijst
            </button>
          </div>
          <Link
            href="/appointments/new"
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Afspraak
          </Link>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-700 dark:text-gray-300">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-700 dark:text-gray-300">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">{day}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasAppointment = appointments.some(a => {
                    const date = new Date(a.date);
                    return date.getDate() === day && date.getMonth() === currentDate.getMonth();
                  });
                  const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                  return (
                    <button
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors relative ${
                        isToday
                          ? 'bg-orange-500 text-white'
                          : hasAppointment 
                            ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30' 
                            : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                      {hasAppointment && (
                        <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Komende Afspraken</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        apt.type === 'PHONE' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 
                        apt.type === 'VIDEO' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                        'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                      }`}>
                        {apt.type === 'PHONE' ? <Phone className="w-5 h-5" /> : 
                         apt.type === 'VIDEO' ? <Video className="w-5 h-5" /> :
                         <User className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{apt.clientName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{apt.company}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {apt.location}
                          </span>
                        </div>
                        {apt.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{apt.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Klant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Datum & Tijd</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Locatie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Notities</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          apt.type === 'PHONE' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 
                          apt.type === 'VIDEO' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                          'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                        }`}>
                          {apt.type === 'PHONE' ? <Phone className="w-5 h-5" /> : 
                           apt.type === 'VIDEO' ? <Video className="w-5 h-5" /> :
                           <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{apt.clientName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{apt.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(apt.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{apt.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        apt.type === 'PHONE' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30' : 
                        apt.type === 'VIDEO' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30' :
                        'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                      }`}>
                        {apt.type === 'PHONE' ? 'Telefoon' : apt.type === 'VIDEO' ? 'Video' : 'Fysiek'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {apt.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{apt.notes || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors">
                          Bewerk
                        </button>
                        <button className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                          Annuleer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
