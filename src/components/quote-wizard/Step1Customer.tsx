'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuoteWizardInput } from '@/lib/quote-wizard';
import { User, Euro, Mail, Phone, Building2 } from 'lucide-react';

interface Step1CustomerProps {
  data: QuoteWizardInput;
  onChange: (updates: Partial<QuoteWizardInput>) => void;
}

const providers = [
  { value: '', label: 'Selecteer provider (optioneel)' },
  { value: 'telenet', label: 'Telenet' },
  { value: 'proximus', label: 'Proximus' },
  { value: 'orange', label: 'Orange (blijven)' },
  { value: 'scarlet', label: 'Scarlet' },
  { value: 'other', label: 'Andere' },
];

export function Step1Customer({ data, onChange }: Step1CustomerProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Klantnaam */}
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Klantnaam <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="customerName"
            placeholder="Jan Jansen"
            value={data.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Huidige maandelijkse kosten */}
        <div className="space-y-2">
          <Label htmlFor="currentMonthlyCost" className="flex items-center">
            <Euro className="w-4 h-4 mr-2" />
            Huidige maandelijkse kosten <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">€</span>
            <Input
              id="currentMonthlyCost"
              type="number"
              placeholder="75.00"
              className="pl-8 h-12"
              value={data.currentMonthlyCost || ''}
              onChange={(e) => onChange({ currentMonthlyCost: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <p className="text-sm text-gray-500">
            Wat betaalt de klant nu per maand bij zijn huidige operator?
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="customerEmail" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder="jan@example.com"
            value={data.customerEmail || ''}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            className="h-12"
          />
          <p className="text-sm text-gray-500">
            Nodig om de offerte digitaal te versturen
          </p>
        </div>

        {/* Telefoon */}
        <div className="space-y-2">
          <Label htmlFor="customerPhone" className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Telefoon
          </Label>
          <Input
            id="customerPhone"
            placeholder="0472 12 34 56"
            value={data.customerPhone || ''}
            onChange={(e) => onChange({ customerPhone: e.target.value })}
            className="h-12"
          />
          <p className="text-sm text-gray-500">
            Voor WhatsApp berichten
          </p>
        </div>

        {/* Huidige provider */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="currentProvider" className="flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            Huidige provider
          </Label>
          <select
            id="currentProvider"
            className="w-full h-12 px-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={data.currentProvider || ''}
            onChange={(e) => onChange({ currentProvider: e.target.value })}
          >
            {providers.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <span className="text-lg mr-2">💡</span>
          Tips voor deze stap
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Vraag naar de laatste factuur voor het exacte bedrag</li>
          <li>• Noteer ook de huidige provider (voor portability bonus)</li>
          <li>• Email is nodig om de offerte digitaal te versturen</li>
        </ul>
      </div>

      {/* Required field hint */}
      <p className="text-sm text-gray-500">
        <span className="text-red-500">*</span> Verplichte velden
      </p>
    </div>
  );
}
