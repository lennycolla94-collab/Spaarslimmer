'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  sales: number;
  lost: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Laden...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">SmartSN CRM</h1>
          <div className="flex items-center gap-4">
            <Link href="/leads" className="text-gray-600 hover:text-gray-900">
              Mijn Leads
            </Link>
            <span className="text-gray-600">{session.user?.name}</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
              {session.user?.role}
            </span>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/call-center"
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md transition-colors flex items-center gap-4"
            >
              <span className="text-4xl">📞</span>
              <div>
                <div className="text-xl font-bold">Bel Centrum</div>
                <div className="text-green-100">Start met bellen</div>
              </div>
            </Link>

            <Link
              href="/leads/import"
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-md transition-colors flex items-center gap-4"
            >
              <span className="text-4xl">📁</span>
              <div>
                <div className="text-xl font-bold">Import Leads</div>
                <div className="text-blue-100">CSV upload</div>
              </div>
            </Link>

            <Link
              href="/leads"
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md transition-colors flex items-center gap-4"
            >
              <span className="text-4xl">👥</span>
              <div>
                <div className="text-xl font-bold">Alle Leads</div>
                <div className="text-purple-100">Bekijk lijst</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mijn Leads</h2>
            <Link href="/leads" className="text-blue-600 hover:text-blue-800">
              Bekijk alle →
            </Link>
          </div>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Totaal</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
                <div className="text-sm text-gray-500">Nieuw</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.contacted}</div>
                <div className="text-sm text-gray-500">Gecontacteerd</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.quoted}</div>
                <div className="text-sm text-gray-500">Offerte</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.sales}</div>
                <div className="text-sm text-gray-500">Verkoop</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-red-600">{stats.lost}</div>
                <div className="text-sm text-gray-500">Verloren</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Geen statistieken beschikbaar</div>
          )}
        </div>

        {/* Conversion Rate */}
        {stats && stats.total > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversie Ratio</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all"
                  style={{ width: `${(stats.sales / stats.total) * 100}%` }}
                />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {((stats.sales / stats.total) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stats.sales} verkopen uit {stats.total} leads
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
