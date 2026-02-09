'use client';

import { PageContainer, PageHeader, SmartCard, ActionButton } from '@/components/design-system/page-container';
import { BarChart3, ArrowLeft, Download, TrendingUp, Users, Phone, Euro } from 'lucide-react';

export default function ReportsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Rapporten"
        subtitle="Uitgebreide analyses"
        icon={<BarChart3 className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </ActionButton>
            <ActionButton variant="secondary" icon={<Download className="w-4 h-4" />}>
              Exporteer
            </ActionButton>
          </div>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">108</p>
                <p className="text-sm text-gray-500">Calls</p>
              </div>
            </div>
          </SmartCard>
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-500">Sales</p>
              </div>
            </div>
          </SmartCard>
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-sm text-gray-500">Conversie</p>
              </div>
            </div>
          </SmartCard>
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Euro className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">€450</p>
                <p className="text-sm text-gray-500">Commissie</p>
              </div>
            </div>
          </SmartCard>
        </div>

        {/* Chart Placeholder */}
        <SmartCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activiteit deze maand</h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-400">Grafiek komt hier (vereist chart library)</p>
          </div>
        </SmartCard>
      </main>
    </PageContainer>
  );
}
