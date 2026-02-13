'use client';

export const dynamic = 'force-dynamic';

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
  ChevronRight
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
    status: 'SCHEDULED'
  },
  {
    id: '2',
    clientName: 'Jan Janssen',
    company: 'Tech Solutions BV',
    date: '2025-02-14',
    time: '16:30',
    type: 'PHONE',
    location: 'Phone Call',
    status: 'SCHEDULED'
  },
  {
    id: '3',
    clientName: 'Necmi Yildiz',
    company: 'NecmiCuts',
    date: '2025-02-15',
    time: '10:00',
    type: 'PHYSICAL',
    location: 'Aalst',
    status: 'SCHEDULED'
  }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Afspraken</h1>
          <p className="text-gray-500 mt-1">Beheer je afspraken en meetings</p>
        </div>
        <Link
          href="/leads"
          className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Afspraak
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
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
                return (
                  <button
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      hasAppointment 
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day}
                    {hasAppointment && <span className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Komende Afspraken</h2>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      apt.type === 'PHONE' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {apt.type === 'PHONE' ? <Phone className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{apt.clientName}</p>
                      <p className="text-sm text-gray-500">{apt.company}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {apt.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
