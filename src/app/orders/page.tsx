'use client';

import { PageContainer, PageHeader, SmartCard, ActionButton } from '@/components/design-system/page-container';
import { ShoppingCart, ArrowLeft, Plus, CheckCircle2, Clock, Package } from 'lucide-react';

const orders = [
  { id: '1', customer: 'Tech Solutions BV', products: 'Internet Zen + 2x Mobile', amount: '€149', status: 'pending', date: '2025-02-12' },
  { id: '2', customer: 'Bakkerij De Lekkernij', products: 'Internet Start + TV', amount: '€89', status: 'completed', date: '2025-02-10' },
  { id: '3', customer: 'Marketing Agency', products: '4x Mobile Unlimited', amount: '€199', status: 'pending', date: '2025-02-08' },
];

export default function OrdersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        subtitle="Overzicht van je verkopen"
        icon={<ShoppingCart className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </ActionButton>
            <ActionButton href="/orders/new" variant="primary" icon={<Plus className="w-4 h-4" />}>
              Nieuwe Order
            </ActionButton>
          </div>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </SmartCard>
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </SmartCard>
          <SmartCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </SmartCard>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <SmartCard key={order.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{order.customer}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{order.products}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{order.amount}</p>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
              </div>
            </SmartCard>
          ))}
        </div>
      </main>
    </PageContainer>
  );
}
