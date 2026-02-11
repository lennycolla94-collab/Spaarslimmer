'use client';

import { PageContainer, PageHeader, SmartCard, ActionButton } from '@/components/design-system/page-container';
import { Shield, Mail, Phone, Download, UserX, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Privacybeleid"
        subtitle="Jouw privacy is belangrijk voor ons"
        icon={<Shield className="w-6 h-6 text-white" />}
        action={
          <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Dashboard
          </ActionButton>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SmartCard className="p-8 mb-6">
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacybeleid SmartSN CRM</h1>
            <p className="text-gray-600 mb-6">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Wie zijn wij?</h2>
              <p className="text-gray-600 mb-4">
                SmartSN CRM is een platform voor energieconsultants. Wij helpen consultants bij het 
                beheren van klantrelaties en het aanbieden van energieproducten.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>Contactgegevens:</strong><br />
                  SmartSN BV<br />
                  Email: privacy@smartsn.be<br />
                  Tel: +32 3 123 45 67
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Welke gegevens verzamelen wij?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h3 className="font-medium text-gray-900 mb-2">Consultant Gegevens</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Naam en email</li>
                    <li>• Telefoonnummer</li>
                    <li>• BTW nummer (voor SoHo)</li>
                    <li>• Bankrekening (voor uitbetaling)</li>
                  </ul>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h3 className="font-medium text-gray-900 mb-2">Klant Gegevens (Leads)</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bedrijfsnaam en contactpersoon</li>
                    <li>• Email en telefoon (geëncrypteerd)</li>
                    <li>• Adresgegevens</li>
                    <li>• Huidige energieprovider</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Hoe beschermen wij je gegevens?</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Encryptie:</strong> AES-256 encryptie voor alle persoonsgegevens</li>
                <li><strong>Toegang:</strong> Strikte role-based access control</li>
                <li><strong>Retentie:</strong> Automatische verwijdering na 7 jaar</li>
                <li><strong>Audit logging:</strong> Alle data wijzigingen worden gelogd</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Jouw rechten onder GDPR</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Recht op vergetelheid:</strong> Je kunt je account laten verwijderen</li>
                <li><strong>Recht op dataportabiliteit:</strong> Exporteer je gegevens</li>
                <li><strong>Recht op inzage:</strong> Zie welke gegevens wij hebben</li>
                <li><strong>Recht op correctie:</strong> Wijzig onjuiste gegevens</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact</h2>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:privacy@smartsn.be" className="flex items-center gap-2 text-orange-600 hover:underline">
                  <Mail className="w-4 h-4" />
                  privacy@smartsn.be
                </a>
                <a href="tel:+3231234567" className="flex items-center gap-2 text-orange-600 hover:underline">
                  <Phone className="w-4 h-4" />
                  +32 3 123 45 67
                </a>
              </div>
            </section>
          </div>
        </SmartCard>

        {/* Data Rights Actions */}
        <SmartCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Jouw Data Rechten</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
              <Download className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Exporteer mijn data</p>
                <p className="text-sm text-gray-500">Download al je gegevens (JSON)</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors text-left">
              <UserX className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Verwijder mijn account</p>
                <p className="text-sm text-gray-500">Permanente verwijdering (GDPR)</p>
              </div>
            </button>
          </div>
        </SmartCard>
      </main>
    </PageContainer>
  );
}
