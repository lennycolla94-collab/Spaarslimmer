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
  FilterTabs,
} from '@/components/design-system/page-container';
import { 
  FileText, 
  Plus,
  Eye,
  Send,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Mail,
  MessageCircle,
  Calendar,
  MoreVertical,
  ArrowRight,
  Euro,
  Users
} from 'lucide-react';

// Mock data
const mockOffers = [
  { 
    id: '1', 
    leadName: 'Tech Solutions BV', 
    contactName: 'Jan Janssen',
    amount: 14900, 
    status: 'SENT',
    date: '2025-02-08',
    products: ['Internet Zen', 'Mobile Medium x2'],
    savings: 3600
  },
  { 
    id: '2', 
    leadName: 'Bakkerij De Lekkernij', 
    contactName: 'Maria Peeters',
    amount: 8900, 
    status: 'ACCEPTED',
    date: '2025-02-07',
    products: ['Internet Start', 'Mobile Small'],
    savings: 1200
  },
  { 
    id: '3', 
    leadName: 'Constructie Groep', 
    contactName: 'Peter Willems',
    amount: 23400, 
    status: 'PENDING',
    date: '2025-02-05',
    products: ['Internet Giga', 'Mobile Unlimited x3', 'TV Plus'],
    savings: 5600
  },
  { 
    id: '4', 
    leadName: 'Fashion Store', 
    contactName: 'Lisa Dubois',
    amount: 11200, 
    status: 'CONVERTED',
    date: '2025-02-01',
    products: ['Internet Zen', 'Mobile Large', 'TV'],
    savings: 2400
  },
];

const statusConfig = {
  DRAFT: { label: 'Concept', color: 'bg-gray-100 text-gray-700', icon: FileText },
  SENT: { label: 'Verstuurd', color: 'bg-blue-100 text-blue-700', icon: Send },
  PENDING: { label: 'In Afwachting', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  ACCEPTED: { label: 'Geaccepteerd', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  CONVERTED: { label: 'Omgezet', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  REJECTED: { label: 'Afgewezen', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OffersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOffers = mockOffers.filter(offer => 
    statusFilter === 'ALL' || offer.status === statusFilter
  );

  const stats = {
    total: mockOffers.length,
    sent: mockOffers.filter(o => o.status === 'SENT').length,
    pending: mockOffers.filter(o => o.status === 'PENDING').length,
    accepted: mockOffers.filter(o => o.status === 'ACCEPTED' || o.status === 'CONVERTED').length,
    totalValue: mockOffers.reduce((sum, o) => sum + o.amount, 0),
    totalSavings: mockOffers.reduce((sum, o) => sum + o.savings, 0),
  };

  const filterOptions = [
    { value: 'ALL', label: 'Alle', count: stats.total },
    { value: 'SENT', label: 'Verstuurd', count: stats.sent },
    { value: 'PENDING', label: 'In Afwachting', count: stats.pending },
    { value: 'ACCEPTED', label: 'Geaccepteerd', count: stats.accepted },
  ];

  const formatEuro = (cents: number) => {
    return '€' + (cents / 100).toFixed(2).replace('.', ',');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Verkoop & Offertes"
        subtitle="Beheer je offertes en converteer naar sales"
        icon={<FileText className="w-6 h-6 text-white" />}
        action={
          <ActionButton href="/leads" variant="primary" icon={<Plus className="w-4 h-4" />}>
            Nieuwe Offerte
          </ActionButton>
        }
        stats={[
          { label: 'Totaal Offertes', value: stats.total.toString() },
          { label: 'Omzet Potentieel', value: formatEuro(stats.totalValue) },
          { label: 'Klant Besparing', value: formatEuro(stats.totalSavings) },
          { label: 'Conversie Rate', value: '67%', trend: '+12%' },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Open Offertes"
            value={stats.sent + stats.pending}
            icon={<FileText className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label="Geaccepteerd"
            value={stats.accepted}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="green"
            trend="up"
            trendValue="+3 deze week"
          />
          <StatCard
            label="Totale Waarde"
            value={formatEuro(stats.totalValue)}
            icon={<Euro className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            label="Klant Besparing"
            value={formatEuro(stats.totalSavings)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Filters */}
        <SmartCard className="p-4 mb-6">
          <FilterTabs
            options={filterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </SmartCard>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <SmartCard>
            <EmptyState
              icon={<FileText className="w-10 h-10" />}
              title="Geen offertes gevonden"
              description="Maak je eerste offerte om te beginnen met verkopen."
              action={
                <ActionButton href="/leads" variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Nieuwe Offerte
                </ActionButton>
              }
            />
          </SmartCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOffers.map((offer) => {
              const status = statusConfig[offer.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <SmartCard key={offer.id} className="group">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.leadName}</h3>
                        <p className="text-sm text-gray-500">{offer.contactName}</p>
                      </div>
                      <Badge variant={
                        offer.status === 'SENT' ? 'info' :
                        offer.status === 'PENDING' ? 'warning' :
                        offer.status === 'ACCEPTED' || offer.status === 'CONVERTED' ? 'success' :
                        offer.status === 'REJECTED' ? 'error' : 'default'
                      }>
                        <span className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </Badge>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase mb-2">Producten</p>
                      <div className="flex flex-wrap gap-2">
                        {offer.products.map((product, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-500">Maandbedrag</p>
                        <p className="text-xl font-bold text-gray-900">{formatEuro(offer.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Besparing</p>
                        <p className="text-xl font-bold text-green-600">{formatEuro(offer.savings)}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {new Date(offer.date).toLocaleDateString('nl-BE')}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </SmartCard>
              );
            })}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
