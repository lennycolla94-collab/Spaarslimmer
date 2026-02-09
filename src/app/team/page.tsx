'use client';

import { PageContainer, PageHeader, SmartCard, ActionButton } from '@/components/design-system/page-container';
import { Users, ArrowLeft, Mail, Phone, TrendingUp, Award } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    { name: 'Sarah Smith', rank: 'SC', asp: 28, sales: 12 },
    { name: 'Mike Johnson', rank: 'BC', asp: 12, sales: 5 },
    { name: 'Lisa Chen', rank: 'BC', asp: 8, sales: 3 },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Team Management"
        subtitle="Beheer je downline"
        icon={<Users className="w-6 h-6 text-white" />}
        action={
          <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Dashboard
          </ActionButton>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Sponsor */}
        <SmartCard className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <p className="text-sm text-gray-500 mb-2">Jouw Sponsor</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <div>
              <p className="text-xl font-bold">John Doe</p>
              <p className="text-purple-600">Team Director (TD)</p>
            </div>
          </div>
        </SmartCard>

        {/* Team Members */}
        <h3 className="text-lg font-semibold mb-4">Jouw Downline ({teamMembers.length})</h3>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <SmartCard key={member.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.rank} • {member.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{member.asp}</p>
                  <p className="text-xs text-gray-500">ASP</p>
                </div>
              </div>
            </SmartCard>
          ))}
        </div>
      </main>
    </PageContainer>
  );
}
