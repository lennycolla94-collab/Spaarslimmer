'use client';

import { useState } from 'react';
import { PageContainer, PageHeader, SmartCard, ActionButton } from '@/components/design-system/page-container';
import { 
  ShoppingCart, ArrowLeft, Check, Plus, Trash2, Building2, 
  Wifi, Smartphone, Tv, Zap, CheckCircle2
} from 'lucide-react';

export default function NewOrderPage() {
  const [selectedLead, setSelectedLead] = useState('');
  const [internet, setInternet] = useState('');
  const [mobiles, setMobiles] = useState<string[]>([]);

  const addMobile = () => setMobiles([...mobiles, 'MEDIUM']);
  const removeMobile = (i: number) => setMobiles(mobiles.filter((_, idx) => idx !== i));

  return (
    <PageContainer>
      <PageHeader
        title="Nieuwe Order"
        subtitle="Registreer een verkoop"
        icon={<ShoppingCart className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </ActionButton>
            <ActionButton href="/leads" variant="secondary" icon={<Building2 className="w-4 h-4" />}>
              Leads
            </ActionButton>
          </div>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SmartCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">1. Klant</h3>
              <select value={selectedLead} onChange={(e) => setSelectedLead(e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="">Selecteer lead...</option>
                <option value="1">Tech Solutions BV</option>
              </select>
            </SmartCard>
            <SmartCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">2. Internet</h3>
              <div className="grid grid-cols-3 gap-3">
                {['START', 'ZEN', 'GIGA'].map((p) => (
                  <button key={p} onClick={() => setInternet(p)} className={`p-4 rounded-xl border-2 ${internet === p ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <p className="font-medium">{p}</p>
                  </button>
                ))}
              </div>
            </SmartCard>
            <SmartCard className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">3. Mobiel</h3>
                <button onClick={addMobile} className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 bg-orange-50 rounded-lg">
                  <Plus className="w-4 h-4" /> Toevoegen
                </button>
              </div>
              {mobiles.map((_, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select className="flex-1 p-2 border rounded-lg">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                  <button onClick={() => removeMobile(i)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </SmartCard>
          </div>
          <div>
            <SmartCard className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
              <h3 className="text-lg font-semibold mb-4">Samenvatting</h3>
              <p className="text-3xl font-bold text-green-400">€125</p>
              <p className="text-sm text-gray-400">Commissie</p>
            </SmartCard>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
