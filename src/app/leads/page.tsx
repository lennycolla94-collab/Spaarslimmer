'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Building2,
  Edit,
  Trash2,
  X,
  Download,
  ChevronDown,
  Loader2,
  AlertCircle,
  Target,
  LayoutGrid,
  List,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  User,
  ChevronRight,
  Archive
} from 'lucide-react';

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  status: string;
  lastContact: string;
  niche?: string;
}

// Generate realistic leads
const CITIES = ['Antwerpen', 'Gent', 'Brussel', 'Leuven', 'Brugge', 'Hasselt', 'Mechelen', 'Aalst', 'Sint-Niklaas', 'Kortrijk'];
const FIRST_NAMES = ['Jan', 'Maria', 'Peter', 'Anna', 'Luc', 'Sarah', 'Marc', 'Emma', 'Bart', 'Lisa'];
const LAST_NAMES = ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Goossens', 'Wouters', 'De Smet'];
const NICHES = ['Retail', 'Horeca', 'IT', 'Healthcare', 'Construction', 'Finance', 'Food', 'Beauty'];
const STATUSES = ['NEW', 'NEW', 'NEW', 'CONTACTED', 'CONTACTED', 'OFFER_SENT', 'FOLLOW_UP', 'CONVERTED'];

function generateLeads(count: number): Lead[] {
  const leads: Lead[] = [];
  for (let i = 1; i <= count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const niche = NICHES[Math.floor(Math.random() * NICHES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const companyName = `${lastName} ${['BV', 'NV', 'Solutions', 'Group'][Math.floor(Math.random() * 4)]}`;
    const phone = `04${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    const daysAgo = Math.floor(Math.random() * 30);
    const lastContact = daysAgo === 0 ? 'Vandaag' : daysAgo === 1 ? 'Gisteren' : daysAgo < 7 ? `${daysAgo} dagen geleden` : daysAgo < 14 ? '1 week geleden' : '2+ weken geleden';
    
    leads.push({
      id: i.toString(),
      companyName,
      contactName: `${firstName} ${lastName}`,
      phone,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.toLowerCase().replace(/[^a-z]/g, '')}.be`,
      city,
      status,
      lastContact,
      niche
    });
  }
  return leads;
}

const MOCK_LEADS: Lead[] = generateLeads(156);

// Status badge mapping using new design tokens
const getStatusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    NEW: 'status-badge--new',
    CONTACTED: 'status-badge--contacted',
    OFFER_SENT: 'status-badge--qualified',
    FOLLOW_UP: 'status-badge--followup',
    CONVERTED: 'status-badge--won',
    LOST: 'status-badge--lost',
  };
  return map[status] || 'status-badge--new';
};

const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    NEW: 'Nieuw',
    CONTACTED: 'Gecontacteerd',
    OFFER_SENT: 'Offerte Verstuurd',
    FOLLOW_UP: 'Follow-up',
    CONVERTED: 'Omgezet',
    LOST: 'Verloren',
  };
  return map[status] || status;
};

const NicheIcons: Record<string, string> = {
  'Retail': '🏪', 'Horeca': '🍽️', 'IT': '💻', 'Healthcare': '🏥', 
  'Construction': '🏗️', 'Finance': '💰', 'Food': '🍕', 'Beauty': '💅',
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    offers: leads.filter(l => l.status === 'OFFER_SENT').length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead({ ...lead });
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const saveEdit = () => {
    if (!editingLead) return;
    setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
    setShowEditModal(false);
    setEditingLead(null);
  };

  const openDeleteModal = (lead: Lead) => {
    setDeletingLead(lead);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const confirmDelete = () => {
    if (!deletingLead) return;
    setLeads(prev => prev.filter(l => l.id !== deletingLead.id));
    setShowDeleteModal(false);
    setDeletingLead(null);
  };

  const makeOffer = (leadId: string) => {
    window.open(`/calculator?lead=${leadId}`, '_blank');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  if (loading) {
    return (
      <PremiumLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="spinner spinner--lg"></div>
        </div>
      </PremiumLayout>
    );
  }

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Leads</h1>
          <p className="body-small">Beheer en volg al je leads ({stats.total} totaal)</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/leads/import" className="btn btn--secondary">
            <Download className="w-4 h-4" />
            Importeren
          </Link>
          <Link href="/leads/new" className="btn btn--primary">
            <Plus className="w-4 h-4" />
            Nieuwe Lead
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Totaal', value: stats.total, active: statusFilter === 'ALL', onClick: () => setStatusFilter('ALL') },
          { label: 'Nieuw', value: stats.new, active: statusFilter === 'NEW', onClick: () => setStatusFilter('NEW') },
          { label: 'Gecontacteerd', value: stats.contacted, active: statusFilter === 'CONTACTED', onClick: () => setStatusFilter('CONTACTED') },
          { label: 'Offerte', value: stats.offers, active: statusFilter === 'OFFER_SENT', onClick: () => setStatusFilter('OFFER_SENT') },
          { label: 'Omgezet', value: stats.converted, active: statusFilter === 'CONVERTED', onClick: () => setStatusFilter('CONVERTED') },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={stat.onClick}
            className={`stat-filter-card ${stat.active ? 'stat-filter-card--active' : ''}`}
          >
            <p className="stat-filter-label">{stat.label}</p>
            <p className="stat-filter-value">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-bar-section">
          {/* Search */}
          <div className="global-search">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Zoek op bedrijf, contact, stad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <kbd className="search-shortcut">⌘K</kbd>
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">Alle statussen</option>
              <option value="NEW">Nieuw</option>
              <option value="CONTACTED">Gecontacteerd</option>
              <option value="OFFER_SENT">Offerte Verstuurd</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="CONVERTED">Omgezet</option>
              <option value="LOST">Verloren</option>
            </select>
          </div>
        </div>

        <div className="filter-bar-actions">
          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              onClick={() => setViewMode('list')} 
              className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn--active' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'view-toggle-btn--active' : ''}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 body-small">
        Toont {filteredLeads.length} van {stats.total} leads
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-select">
                  <input 
                    type="checkbox" 
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} 
                    onChange={selectAll}
                    className="checkbox" 
                  />
                </th>
                <th className="col-primary">Bedrijf & Contact</th>
                <th>Status</th>
                <th>Locatie</th>
                <th className="col-right">Laatste Contact</th>
                <th className="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="table-row">
                  <td className="col-select">
                    <input 
                      type="checkbox" 
                      checked={selectedLeads.includes(lead.id)} 
                      onChange={() => toggleSelection(lead.id)}
                      className="checkbox" 
                    />
                  </td>
                  <td className="col-primary">
                    <div className="table-cell-main">
                      <div className="avatar-sm">
                        {lead.companyName[0]}
                      </div>
                      <div>
                        <div className="table-cell-title">{lead.companyName}</div>
                        <div className="table-cell-subtitle">{lead.contactName} • {lead.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td>
                    <span className="text-[var(--text-secondary)]">{lead.city}</span>
                  </td>
                  <td className="col-right">
                    <span className="text-[var(--text-secondary)]">{lead.lastContact}</span>
                  </td>
                  <td className="col-actions">
                    <div className="table-actions">
                      <a 
                        href={`tel:${lead.phone}`} 
                        className="btn-icon" 
                        title="Bellen"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button 
                        className="btn-icon" 
                        title="Afspraak"
                        onClick={(e) => { e.stopPropagation(); makeOffer(lead.id); }}
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <div className="dropdown">
                        <button 
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === lead.id ? null : lead.id);
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openDropdown === lead.id && (
                          <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => openEditModal(lead)}>
                              <Edit className="w-4 h-4" />
                              <span>Bewerken</span>
                            </button>
                            <button className="dropdown-item" onClick={() => makeOffer(lead.id)}>
                              <Target className="w-4 h-4" />
                              <span>Offerte maken</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item dropdown-item--danger" onClick={() => openDeleteModal(lead)}>
                              <Trash2 className="w-4 h-4" />
                              <span>Verwijderen</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <h3 className="empty-state-title">Geen leads gevonden</h3>
              <p className="empty-state-description">
                Je hebt nog geen leads. Voeg je eerste lead toe om te beginnen.
              </p>
              <Link href="/leads/new" className="btn btn--primary">
                <Plus className="w-5 h-5" />
                Nieuwe Lead
              </Link>
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="leads-grid">
          {filteredLeads.map((lead) => {
            const icon = NicheIcons[lead.niche || ''] || '🏢';
            return (
              <article key={lead.id} className="lead-card">
                {/* Header */}
                <div className="lead-card-header">
                  <div className="lead-card-avatar">
                    <span>{lead.companyName[0]}</span>
                  </div>
                  <div className="lead-card-title">
                    <h3 className="lead-card-company">{lead.companyName}</h3>
                    <span className="lead-card-industry">{lead.niche}</span>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                    {getStatusLabel(lead.status)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="lead-card-contact">
                  <div className="contact-item">
                    <Phone className="contact-icon" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="contact-item">
                    <MapPin className="contact-icon" />
                    <span>{lead.city}</span>
                  </div>
                  <div className="contact-item">
                    <User className="contact-icon" />
                    <span>{lead.contactName}</span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="lead-card-meta">
                  <span className="meta-item">
                    <Clock className="w-3 h-3" />
                    {lead.lastContact}
                  </span>
                </div>

                {/* Actions */}
                <div className="lead-card-actions">
                  <a 
                    href={`tel:${lead.phone}`}
                    className="btn btn--primary btn--block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-4 h-4" />
                    Bellen
                  </a>
                  
                  <div className="dropdown">
                    <button 
                      className="btn btn--secondary btn--icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === lead.id ? null : lead.id);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openDropdown === lead.id && (
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={() => makeOffer(lead.id)}>
                          <Calendar className="w-4 h-4" />
                          <span>Afspraak maken</span>
                        </button>
                        <button className="dropdown-item" onClick={() => openEditModal(lead)}>
                          <Edit className="w-4 h-4" />
                          <span>Bewerken</span>
                        </button>
                        <button className="dropdown-item">
                          <Archive className="w-4 h-4" />
                          <span>Archiveren</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item dropdown-item--danger" onClick={() => openDeleteModal(lead)}>
                          <Trash2 className="w-4 h-4" />
                          <span>Verwijderen</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Empty State for Grid */}
      {viewMode === 'grid' && filteredLeads.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h3 className="empty-state-title">Geen leads gevonden</h3>
          <p className="empty-state-description">
            Je hebt nog geen leads. Voeg je eerste lead toe om te beginnen.
          </p>
          <Link href="/leads/new" className="btn btn--primary">
            <Plus className="w-5 h-5" />
            Nieuwe Lead
          </Link>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-[280px] right-6 bg-[var(--bg-card)] rounded-xl p-4 flex items-center justify-between shadow-xl border border-white/5 z-50">
          <p className="text-sm text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">{selectedLeads.length}</strong> leads geselecteerd
          </p>
          <div className="flex items-center gap-3">
            <button className="btn btn--secondary btn--sm">Exporteren</button>
            <button className="btn btn--secondary btn--sm">Status wijzigen</button>
            <button className="btn btn--danger btn--sm">Verwijderen</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingLead && (
        <div className="modal-overlay is-open">
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h3 className="modal-title">Lead Bewerken</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                {[
                  { label: 'Bedrijfsnaam', value: editingLead.companyName, key: 'companyName', type: 'text' },
                  { label: 'Contactpersoon', value: editingLead.contactName, key: 'contactName', type: 'text' },
                  { label: 'Telefoon', value: editingLead.phone, key: 'phone', type: 'text' },
                  { label: 'Email', value: editingLead.email, key: 'email', type: 'email' },
                  { label: 'Stad', value: editingLead.city, key: 'city', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="form-label">{field.label}</label>
                    <input 
                      type={field.type} 
                      value={field.value}
                      onChange={(e) => setEditingLead({...editingLead, [field.key]: e.target.value})}
                      className="form-input"
                    />
                  </div>
                ))}
                <div>
                  <label className="form-label">Status</label>
                  <select 
                    value={editingLead.status} 
                    onChange={(e) => setEditingLead({...editingLead, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="NEW">Nieuw</option>
                    <option value="CONTACTED">Gecontacteerd</option>
                    <option value="OFFER_SENT">Offerte Verstuurd</option>
                    <option value="FOLLOW_UP">Follow-up</option>
                    <option value="CONVERTED">Omgezet</option>
                    <option value="LOST">Verloren</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowEditModal(false)}>
                Annuleren
              </button>
              <button className="btn btn--primary" onClick={saveEdit}>
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingLead && (
        <div className="modal-overlay is-open">
          <div className="modal modal--sm" role="dialog" aria-modal="true">
            <div className="modal-body text-center pt-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[var(--error)]" />
              </div>
              <h3 className="modal-title justify-center">Lead Verwijderen</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Weet je zeker dat je <strong className="text-[var(--text-primary)]">{deletingLead.companyName}</strong> wilt verwijderen? 
                Deze actie kan niet ongedaan worden gemaakt.
              </p>
              <div className="flex justify-center gap-3">
                <button className="btn btn--secondary" onClick={() => setShowDeleteModal(false)}>
                  Annuleren
                </button>
                <button className="btn btn--danger" onClick={confirmDelete}>
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        /* Stat Filter Cards */
        .stat-filter-card {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          text-align: left;
          transition: var(--transition-base);
          cursor: pointer;
        }

        .stat-filter-card:hover {
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .stat-filter-card--active {
          background: rgba(255, 107, 53, 0.1);
          border-color: rgba(255, 107, 53, 0.3);
        }

        .stat-filter-label {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }

        .stat-filter-value {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .stat-filter-card--active .stat-filter-value {
          color: var(--primary-orange);
        }

        /* Filter Bar */
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-lg);
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-lg);
        }

        .filter-bar-section {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .filter-bar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        /* Global Search */
        .global-search {
          flex: 1;
          max-width: 400px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: var(--space-md);
          color: var(--text-tertiary);
          width: 18px;
          height: 18px;
        }

        .search-input {
          width: 100%;
          height: 44px;
          padding: 0 80px 0 48px;
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: var(--text-sm);
          transition: var(--transition-base);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .search-shortcut {
          position: absolute;
          right: var(--space-md);
          padding: 4px 8px;
          background: var(--bg-primary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-family: monospace;
        }

        /* View Toggle */
        .view-toggle {
          display: flex;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .view-toggle-btn {
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-tertiary);
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

        /* Data Table */
        .data-table-container {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .data-table thead {
          background: var(--bg-tertiary);
        }

        .data-table th {
          padding: var(--space-md) var(--space-lg);
          text-align: left;
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .data-table td {
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .table-row {
          transition: var(--transition-fast);
        }

        .table-row:hover {
          background: var(--bg-hover);
        }

        .col-select {
          width: 48px;
        }

        .col-primary {
          width: 40%;
        }

        .col-right {
          text-align: right;
        }

        .col-actions {
          width: 120px;
        }

        .table-cell-main {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .table-cell-title {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .table-cell-subtitle {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .avatar-sm {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--font-semibold);
          font-size: var(--text-base);
          flex-shrink: 0;
        }

        .table-actions {
          display: flex;
          gap: var(--space-sm);
          opacity: 0;
          transition: var(--transition-fast);
        }

        .table-row:hover .table-actions {
          opacity: 1;
        }

        .btn-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-icon:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        /* Checkbox */
        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-sm);
          background: transparent;
          cursor: pointer;
          appearance: none;
          transition: var(--transition-fast);
        }

        .checkbox:checked {
          background: var(--primary-orange);
          border-color: var(--primary-orange);
        }

        /* Leads Grid */
        .leads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-lg);
        }

        /* Lead Card */
        .lead-card {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          transition: var(--transition-base);
        }

        .lead-card:hover {
          border-color: rgba(255, 107, 53, 0.3);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .lead-card-header {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .lead-card-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--font-bold);
          font-size: var(--text-lg);
          flex-shrink: 0;
        }

        .lead-card-title {
          flex: 1;
          min-width: 0;
        }

        .lead-card-company {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lead-card-industry {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .lead-card-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
          padding: var(--space-md) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .contact-icon {
          color: var(--text-tertiary);
          width: 16px;
          height: 16px;
        }

        .lead-card-meta {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .lead-card-actions {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: var(--space-sm);
        }

        /* Dropdown */
        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          padding: var(--space-sm);
          z-index: 100;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: var(--text-sm);
          text-align: left;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .dropdown-item:hover {
          background: var(--bg-tertiary);
        }

        .dropdown-item--danger {
          color: var(--error);
        }

        .dropdown-item--danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: var(--space-sm) 0;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl) var(--space-xl);
          text-align: center;
          min-height: 400px;
        }

        .empty-state-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 53, 0.1);
          border-radius: var(--radius-xl);
          font-size: 40px;
          margin-bottom: var(--space-lg);
        }

        .empty-state-title {
          font-size: var(--text-2xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-sm);
        }

        .empty-state-description {
          font-size: var(--text-base);
          color: var(--text-secondary);
          max-width: 400px;
          margin-bottom: var(--space-xl);
          line-height: var(--leading-relaxed);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-base);
        }

        .modal-overlay.is-open {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          transform: scale(0.95);
          transition: var(--transition-base);
        }

        .modal--sm {
          max-width: 400px;
        }

        .modal-overlay.is-open .modal {
          transform: scale(1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .modal-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .modal-close:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .modal-body {
          flex: 1;
          padding: var(--space-lg);
          overflow-y: auto;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          padding: var(--space-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </PremiumLayout>
  );
}
