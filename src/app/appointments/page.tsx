'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  LayoutGrid,
  X,
  FileText,
  Building2,
  MoreHorizontal,
  Edit,
  Trash2,
  CalendarDays,
  Clock3
} from 'lucide-react';
import Link from 'next/link';

// Appointment types with colors
const APPOINTMENT_TYPES = {
  PHYSICAL: { label: 'Fysiek', color: 'meeting', icon: User },
  PHONE: { label: 'Telefoon', color: 'call', icon: Phone },
  VIDEO: { label: 'Video', color: 'demo', icon: Video },
};

// Mock appointments
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    clientName: 'Maria Peeters',
    company: 'Bakkerij De Lekkernij',
    date: '2025-02-14',
    time: '10:00',
    endTime: '10:30',
    type: 'PHONE',
    location: 'Telefoongesprek',
    status: 'SCHEDULED',
    notes: '2e adres bespreken, upsell naar Giga internet'
  },
  {
    id: '2',
    clientName: 'Jan Janssen',
    company: 'Tech Solutions BV',
    date: '2025-02-14',
    time: '14:30',
    endTime: '15:00',
    type: 'PHYSICAL',
    location: 'Brussel',
    status: 'SCHEDULED',
    notes: 'Offerte opvolging'
  },
  {
    id: '3',
    clientName: 'Necmi Yildiz',
    company: 'NecmiCuts',
    date: '2025-02-14',
    time: '16:00',
    endTime: '16:30',
    type: 'VIDEO',
    location: 'Teams',
    status: 'SCHEDULED',
    notes: 'Nieuwe klant, TV + Internet'
  },
  {
    id: '4',
    clientName: 'Lisa Dubois',
    company: 'Fashion Store',
    date: '2025-02-15',
    time: '11:00',
    endTime: '11:30',
    type: 'PHYSICAL',
    location: 'Antwerpen',
    status: 'SCHEDULED',
    notes: 'Mobile bundels bespreken'
  },
  {
    id: '5',
    clientName: 'Peter Willems',
    company: 'Willems Groep',
    date: '2025-02-17',
    time: '09:00',
    endTime: '09:30',
    type: 'PHONE',
    location: 'Telefoongesprek',
    status: 'SCHEDULED',
    notes: 'Contract verlenging'
  },
  {
    id: '6',
    clientName: 'Sophie Martens',
    company: 'Beauty Salon',
    date: '2025-02-18',
    time: '13:30',
    endTime: '14:00',
    type: 'VIDEO',
    location: 'Zoom',
    status: 'SCHEDULED',
    notes: 'Prijsoverleg'
  }
];

const MOCK_LEADS = [
  { id: '1', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters' },
  { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen' },
  { id: '3', companyName: 'NecmiCuts', contactName: 'Necmi Yildiz' },
  { id: '4', companyName: 'Fashion Store', contactName: 'Lisa Dubois' },
  { id: '5', companyName: 'Willems Groep', contactName: 'Peter Willems' },
  { id: '6', companyName: 'Beauty Salon', contactName: 'Sophie Martens' },
];

const MONTH_NAMES = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
const WEEKDAYS = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Quick add modal state
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [quickForm, setQuickForm] = useState({
    clientName: '',
    time: '09:00',
    endTime: '09:30',
    type: 'PHYSICAL',
    location: '',
    notes: ''
  });

  // Load appointments from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAppointments(prev => [...prev, ...parsed]);
    }
  }, []);

  const openQuickAdd = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedDay(day);
    setShowQuickAdd(true);
  };

  // Update end time when start time changes (add 30 min)
  const updateTime = (newTime: string) => {
    const [hours, minutes] = newTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours);
    endDate.setMinutes(minutes + 30);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    
    setQuickForm(prev => ({ ...prev, time: newTime, endTime }));
  };

  const saveQuickAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now().toString(),
      clientName: quickForm.clientName,
      company: quickForm.clientName,
      date: selectedDate,
      time: quickForm.time,
      endTime: quickForm.endTime,
      type: quickForm.type,
      location: quickForm.location,
      status: 'SCHEDULED',
      notes: quickForm.notes
    };
    setAppointments(prev => [...prev, newAppointment]);
    setShowQuickAdd(false);
    setQuickForm({ clientName: '', time: '09:00', endTime: '09:30', type: 'PHYSICAL', location: '', notes: '' });
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  // Get appointments for a specific day
  const getDayAppointments = (day: number) => {
    return appointments.filter(a => {
      const date = new Date(a.date);
      return date.getDate() === day && date.getMonth() === currentDate.getMonth();
    }).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  // Stats
  const stats = {
    total: appointments.length,
    thisMonth: appointments.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length,
    physical: appointments.filter(a => a.type === 'PHYSICAL').length,
    remote: appointments.filter(a => a.type === 'PHONE' || a.type === 'VIDEO').length,
    today: appointments.filter(a => {
      const date = new Date(a.date);
      const today = new Date();
      return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    }).length
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-2">Afspraken</h1>
          <p className="body-small">Beheer je afspraken en meetings</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('calendar')}
              className={`view-toggle-btn ${viewMode === 'calendar' ? 'view-toggle-btn--active' : ''}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Kalender</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn--active' : ''}`}
            >
              <List className="w-4 h-4" />
              <span>Lijst</span>
            </button>
          </div>
          <button
            onClick={() => openQuickAdd(new Date().getDate())}
            className="btn btn--primary"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Afspraak
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid stats-grid--compact mb-8">
        <div className="stat-card stat-card--compact">
          <div className="stat-card-icon stat-card-icon--blue">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Totaal</span>
            <span className="stat-card-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card stat-card--compact">
          <div className="stat-card-icon stat-card-icon--purple">
            <Clock3 className="w-5 h-5" />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Deze Maand</span>
            <span className="stat-card-value">{stats.thisMonth}</span>
          </div>
        </div>
        <div className="stat-card stat-card--compact">
          <div className="stat-card-icon stat-card-icon--green">
            <User className="w-5 h-5" />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Fysiek</span>
            <span className="stat-card-value">{stats.physical}</span>
          </div>
        </div>
        <div className="stat-card stat-card--compact">
          <div className="stat-card-icon stat-card-icon--orange">
            <Phone className="w-5 h-5" />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Telefoon/Video</span>
            <span className="stat-card-value">{stats.remote}</span>
          </div>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="calendar-layout">
          {/* Main Calendar */}
          <div className="calendar-main">
            {/* Calendar Header */}
            <div className="calendar-header">
              <h2 className="heading-3">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="calendar-controls">
                <button onClick={goToToday} className="btn btn--secondary btn--sm">
                  Vandaag
                </button>
                <div className="calendar-nav">
                  <button onClick={prevMonth} className="btn btn--secondary btn--icon">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="btn btn--secondary btn--icon">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-wrapper">
              {/* Weekday Headers */}
              <div className="calendar-weekdays">
                {WEEKDAYS.map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="calendar-days">
                {/* Empty cells for start of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day calendar-day--empty" />
                ))}
                
                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayAppointments = getDayAppointments(day);
                  const hasAppointments = dayAppointments.length > 0;
                  const today = isToday(day);
                  const isSelected = selectedDay === day;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`calendar-day ${today ? 'calendar-day--today' : ''} ${isSelected ? 'calendar-day--selected' : ''} ${hasAppointments ? 'calendar-day--has-events' : ''}`}
                    >
                      <div className="calendar-day-header">
                        <span className="calendar-day-number">{day}</span>
                        {hasAppointments && (
                          <span className="calendar-day-badge">{dayAppointments.length}</span>
                        )}
                      </div>
                      
                      {/* Events in day cell */}
                      <div className="calendar-day-events">
                        {dayAppointments.slice(0, 3).map((apt, idx) => {
                          const typeConfig = APPOINTMENT_TYPES[apt.type as keyof typeof APPOINTMENT_TYPES];
                          return (
                            <div 
                              key={apt.id} 
                              className={`calendar-event calendar-event--${typeConfig.color}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle event click
                              }}
                            >
                              <span className="calendar-event-time">{apt.time} - {apt.endTime}</span>
                              <span className="calendar-event-title">{apt.clientName}</span>
                            </div>
                          );
                        })}
                        {dayAppointments.length > 3 && (
                          <div className="calendar-day-more">
                            +{dayAppointments.length - 3} meer
                          </div>
                        )}
                      </div>

                      {/* Add button on hover */}
                      <button 
                        className="calendar-day-add"
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickAdd(day);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Panel - Selected Day Details */}
          <div className="calendar-sidebar">
            <div className="calendar-sidebar-header">
              <h3 className="heading-4">
                {selectedDay ? (
                  <>
                    {selectedDay} {MONTH_NAMES[currentDate.getMonth()]}
                    {isToday(selectedDay) && <span className="calendar-today-badge">Vandaag</span>}
                  </>
                ) : (
                  'Selecteer een dag'
                )}
              </h3>
              {selectedDay && (
                <button 
                  className="btn btn--primary btn--sm"
                  onClick={() => openQuickAdd(selectedDay)}
                >
                  <Plus className="w-4 h-4" />
                  Toevoegen
                </button>
              )}
            </div>

            <div className="calendar-sidebar-content">
              {selectedDay ? (
                getDayAppointments(selectedDay).length > 0 ? (
                  <div className="appointment-list">
                    {getDayAppointments(selectedDay).map((apt) => {
                      const typeConfig = APPOINTMENT_TYPES[apt.type as keyof typeof APPOINTMENT_TYPES];
                      const Icon = typeConfig.icon;
                      return (
                        <div key={apt.id} className="appointment-card">
                          <div className={`appointment-card-icon appointment-card-icon--${typeConfig.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="appointment-card-content">
                            <div className="appointment-card-header">
                              <h4 className="appointment-card-title">{apt.clientName}</h4>
                              <span className="appointment-card-time">{apt.time} - {apt.endTime}</span>
                            </div>
                            <p className="appointment-card-company">{apt.company}</p>
                            <div className="appointment-card-meta">
                              <MapPin className="w-3 h-3" />
                              <span>{apt.location}</span>
                            </div>
                            {apt.notes && (
                              <p className="appointment-card-notes">{apt.notes}</p>
                            )}
                          </div>
                          <div className="appointment-card-actions">
                            <button className="btn-icon btn-icon--sm">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="btn-icon btn-icon--sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state empty-state--compact">
                    <div className="empty-state-icon empty-state-icon--small">📅</div>
                    <p className="empty-state-title empty-state-title--small">Geen afspraken</p>
                    <p className="empty-state-description">Deze dag heeft nog geen afspraken gepland.</p>
                    <button 
                      className="btn btn--secondary btn--sm mt-4"
                      onClick={() => openQuickAdd(selectedDay)}
                    >
                      <Plus className="w-4 h-4" />
                      Afspraak maken
                    </button>
                  </div>
                )
              ) : (
                <div className="empty-state empty-state--compact">
                  <div className="empty-state-icon empty-state-icon--small">👆</div>
                  <p className="empty-state-title empty-state-title--small">Selecteer een dag</p>
                  <p className="empty-state-description">Klik op een dag in de kalender om de afspraken te zien.</p>
                </div>
              )}
            </div>

            {/* Upcoming Preview */}
            <div className="calendar-upcoming">
              <h4 className="calendar-upcoming-title">Komende Afspraken</h4>
              <div className="calendar-upcoming-list">
                {appointments
                  .filter(a => new Date(a.date) >= new Date())
                  .slice(0, 3)
                  .map((apt) => {
                    const typeConfig = APPOINTMENT_TYPES[apt.type as keyof typeof APPOINTMENT_TYPES];
                    const Icon = typeConfig.icon;
                    return (
                      <div key={apt.id} className="calendar-upcoming-item">
                        <div className={`calendar-upcoming-icon calendar-upcoming-icon--${typeConfig.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="calendar-upcoming-content">
                          <p className="calendar-upcoming-name">{apt.clientName}</p>
                          <p className="calendar-upcoming-time">
                            {new Date(apt.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })} • {apt.time} - {apt.endTime}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-primary">Klant</th>
                <th>Datum & Tijd</th>
                <th>Type</th>
                <th>Locatie</th>
                <th className="col-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => {
                const typeConfig = APPOINTMENT_TYPES[apt.type as keyof typeof APPOINTMENT_TYPES];
                const Icon = typeConfig.icon;
                return (
                  <tr key={apt.id} className="table-row">
                    <td className="col-primary">
                      <div className="table-cell-main">
                        <div className={`avatar-sm avatar-sm--${typeConfig.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="table-cell-title">{apt.clientName}</div>
                          <div className="table-cell-subtitle">{apt.company}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="appointment-date">
                        <span className="appointment-date-day">
                          {new Date(apt.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="appointment-date-time">{apt.time} - {apt.endTime}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${typeConfig.color === 'call' ? 'new' : typeConfig.color === 'meeting' ? 'won' : 'qualified'}`}>
                        {typeConfig.label}
                      </span>
                    </td>
                    <td>
                      <span className="text-[var(--text-secondary)] flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {apt.location}
                      </span>
                    </td>
                    <td className="col-right">
                      <div className="table-actions">
                        <button className="btn-icon" title="Bewerken">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn-icon btn-icon--danger" title="Annuleren">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="modal-overlay is-open" onClick={() => setShowQuickAdd(false)}>
          <div className="modal modal--md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nieuwe Afspraak</h3>
              <button className="modal-close" onClick={() => setShowQuickAdd(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveQuickAppointment} className="modal-body">
              <div className="form-grid form-grid--2">
                <div className="form-group">
                  <label className="form-label">Datum</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tijd</label>
                  <input
                    type="time"
                    value={quickForm.time}
                    onChange={(e) => setQuickForm({ ...quickForm, time: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Klant</label>
                <select
                  value={quickForm.clientName}
                  onChange={(e) => setQuickForm({ ...quickForm, clientName: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="">Selecteer een klant...</option>
                  {MOCK_LEADS.map(lead => (
                    <option key={lead.id} value={lead.contactName}>
                      {lead.companyName} - {lead.contactName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-grid form-grid--2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    value={quickForm.type}
                    onChange={(e) => setQuickForm({ ...quickForm, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="PHYSICAL">Fysiek</option>
                    <option value="PHONE">Telefoon</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Locatie</label>
                  <input
                    type="text"
                    value={quickForm.location}
                    onChange={(e) => setQuickForm({ ...quickForm, location: e.target.value })}
                    placeholder={quickForm.type === 'PHONE' ? 'Telefoongesprek' : quickForm.type === 'VIDEO' ? 'Teams/Zoom' : 'Adres...'}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Notities</label>
                <textarea
                  value={quickForm.notes}
                  onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })}
                  placeholder="Optionele notities..."
                  rows={3}
                  className="form-input form-input--textarea"
                />
              </div>
            </form>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="btn btn--secondary"
              >
                Annuleren
              </button>
              <button
                type="submit"
                onClick={saveQuickAppointment}
                className="btn btn--primary"
              >
                Afspraak Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        /* View Toggle */
        .view-toggle {
          display: flex;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          color: var(--text-tertiary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          transition: var(--transition-fast);
        }

        .view-toggle-btn:hover {
          color: var(--text-primary);
        }

        .view-toggle-btn--active {
          background: var(--bg-card);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        /* Stats Grid Compact */
        .stats-grid--compact {
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }

        .stat-card--compact {
          padding: var(--space-md);
        }

        .stat-card-icon--blue {
          background: rgba(59, 130, 246, 0.15);
          color: #60A5FA;
        }

        .stat-card-icon--purple {
          background: rgba(139, 92, 246, 0.15);
          color: #A78BFA;
        }

        .stat-card-icon--green {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
        }

        .stat-card-icon--orange {
          background: rgba(249, 115, 22, 0.15);
          color: #FB923C;
        }

        /* Calendar Layout */
        .calendar-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-lg);
        }

        @media (max-width: 1200px) {
          .calendar-layout {
            grid-template-columns: 1fr;
          }
          .calendar-sidebar {
            position: static;
          }
        }

        /* Calendar Main */
        .calendar-main {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
        }

        .calendar-controls {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .calendar-nav {
          display: flex;
          gap: var(--space-sm);
        }

        /* Calendar Grid */
        .calendar-wrapper {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: var(--bg-tertiary);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .calendar-weekday {
          padding: var(--space-md);
          text-align: center;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-auto-rows: minmax(120px, auto);
          gap: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .calendar-day {
          background: var(--bg-card);
          min-height: 120px;
          padding: var(--space-sm);
          position: relative;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .calendar-day:hover {
          background: var(--bg-hover);
        }

        .calendar-day--empty {
          background: var(--bg-tertiary);
          cursor: default;
        }

        .calendar-day--today {
          background: rgba(255, 107, 53, 0.05);
        }

        .calendar-day--today .calendar-day-number {
          background: var(--primary-gradient);
          color: white;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          font-weight: var(--font-semibold);
        }

        .calendar-day--selected {
          box-shadow: inset 0 0 0 2px var(--primary-orange);
        }

        .calendar-day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .calendar-day-number {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .calendar-day-badge {
          font-size: var(--text-xs);
          padding: 2px 6px;
          background: var(--primary-gradient);
          color: white;
          border-radius: var(--radius-full);
          font-weight: var(--font-semibold);
        }

        .calendar-day-events {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .calendar-event {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          border-left: 3px solid;
          cursor: pointer;
          transition: var(--transition-fast);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .calendar-event:hover {
          transform: translateX(2px);
        }

        .calendar-event--call {
          background: rgba(59, 130, 246, 0.1);
          border-left-color: #3B82F6;
          color: #60A5FA;
        }

        .calendar-event--meeting {
          background: rgba(16, 185, 129, 0.1);
          border-left-color: #10B981;
          color: #34D399;
        }

        .calendar-event--demo {
          background: rgba(139, 92, 246, 0.1);
          border-left-color: #8B5CF6;
          color: #A78BFA;
        }

        .calendar-event-time {
          font-weight: var(--font-semibold);
          margin-right: 4px;
          font-size: var(--text-xs);
        }

        .calendar-event-title {
          opacity: 0.9;
        }

        .calendar-day-more {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          padding: 4px;
          text-align: center;
          cursor: pointer;
        }

        .calendar-day-more:hover {
          color: var(--primary-orange);
        }

        .calendar-day-add {
          position: absolute;
          bottom: var(--space-sm);
          right: var(--space-sm);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: var(--text-tertiary);
          opacity: 0;
          transition: var(--transition-fast);
          cursor: pointer;
        }

        .calendar-day:hover .calendar-day-add {
          opacity: 1;
        }

        .calendar-day-add:hover {
          background: var(--primary-orange);
          color: white;
          border-color: var(--primary-orange);
        }

        /* Calendar Sidebar */
        .calendar-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .calendar-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
        }

        .calendar-today-badge {
          margin-left: var(--space-sm);
          padding: 4px 10px;
          background: var(--primary-gradient);
          color: white;
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          border-radius: var(--radius-full);
        }

        .calendar-sidebar-content {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          min-height: 300px;
        }

        /* Appointment Cards */
        .appointment-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .appointment-card {
          display: flex;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
        }

        .appointment-card:hover {
          border-color: rgba(255, 107, 53, 0.3);
          transform: translateY(-2px);
        }

        .appointment-card-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .appointment-card-icon--call {
          background: rgba(59, 130, 246, 0.15);
          color: #60A5FA;
        }

        .appointment-card-icon--meeting {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
        }

        .appointment-card-icon--demo {
          background: rgba(139, 92, 246, 0.15);
          color: #A78BFA;
        }

        .appointment-card-content {
          flex: 1;
          min-width: 0;
        }

        .appointment-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .appointment-card-title {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .appointment-card-time {
          font-size: var(--text-xs);
          color: var(--primary-orange);
          font-weight: var(--font-semibold);
        }

        .appointment-card-company {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
        }

        .appointment-card-meta {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .appointment-card-notes {
          margin-top: var(--space-sm);
          padding-top: var(--space-sm);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          line-height: var(--leading-relaxed);
        }

        .appointment-card-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          opacity: 0;
          transition: var(--transition-fast);
        }

        .appointment-card:hover .appointment-card-actions {
          opacity: 1;
        }

        /* Calendar Upcoming */
        .calendar-upcoming {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .calendar-upcoming-title {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-md);
        }

        .calendar-upcoming-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .calendar-upcoming-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .calendar-upcoming-icon {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .calendar-upcoming-icon--call {
          background: rgba(59, 130, 246, 0.15);
          color: #60A5FA;
        }

        .calendar-upcoming-icon--meeting {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
        }

        .calendar-upcoming-icon--demo {
          background: rgba(139, 92, 246, 0.15);
          color: #A78BFA;
        }

        .calendar-upcoming-content {
          flex: 1;
          min-width: 0;
        }

        .calendar-upcoming-name {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .calendar-upcoming-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        /* List View Appointment Date */
        .appointment-date {
          display: flex;
          flex-direction: column;
        }

        .appointment-date-day {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .appointment-date-time {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        /* Avatar variants */
        .avatar-sm--call {
          background: rgba(59, 130, 246, 0.15);
          color: #60A5FA;
        }

        .avatar-sm--meeting {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
        }

        .avatar-sm--demo {
          background: rgba(139, 92, 246, 0.15);
          color: #A78BFA;
        }

        /* Empty States */
        .empty-state--compact {
          padding: var(--space-xl);
          min-height: auto;
        }

        .empty-state-icon--small {
          width: 48px;
          height: 48px;
          font-size: 24px;
        }

        .empty-state-title--small {
          font-size: var(--text-base);
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          gap: var(--space-md);
        }

        .form-grid--2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .form-grid--3 {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 640px) {
          .form-grid--3 {
            grid-template-columns: 1fr;
          }
        }

        /* Button icon danger */
        .btn-icon--danger:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </PremiumLayout>
  );
}
