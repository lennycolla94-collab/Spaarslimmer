'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { QuoteWizardInput } from '@/lib/quote-wizard';
import { InternetPlan, MobilePlan, TVPlan, MobileLine } from '@/lib/tariff-engine';
import { Plus, Trash2, Wifi, Smartphone, Tv } from 'lucide-react';

interface Step2ProductsProps {
  data: QuoteWizardInput;
  onChange: (updates: Partial<QuoteWizardInput>) => void;
}

const internetPlans = [
  { value: '', label: 'Geen internet', price: '' },
  { value: 'START', label: 'Start Fiber', price: '€49 (met mobiel) / €53 (zonder)' },
  { value: 'ZEN', label: 'Zen Fiber', price: '€58 (met mobiel) / €62 (zonder)' },
  { value: 'GIGA', label: 'Giga Fiber', price: '€68 (met mobiel) / €72 (zonder)' },
];

// Eerste GSM kan geen Child zijn - Child alleen als 2e/3e/etc nummer
// BELANGRIJK: Bij 2+ lijnen krijgen ALLE lijnen de 2+ prijs (niet alleen de extra lijnen)
const getMobilePlans = (lineIndex: number, hasInternet: boolean, totalLines: number) => {
  // Bepaal of we 2+ prijzen moeten tonen
  const isMultiLine = totalLines >= 2;
  
  // Eerste lijn: geen Child optie
  if (lineIndex === 0) {
    if (hasInternet) {
      // Met internet: pack prijzen
      if (isMultiLine) {
        // 2+ lijnen in pack: ALLE lijnen krijgen deze prijs
        return [
          { value: 'SMALL', label: 'Small (12GB)', price: '€11' },
          { value: 'MEDIUM', label: 'Medium (70GB)', price: '€15' },
          { value: 'LARGE', label: 'Large (140GB)', price: '€20' },
          { value: 'UNLIMITED', label: 'Unlimited', price: '€30' },
        ];
      }
      // 1 lijn in pack
      return [
        { value: 'SMALL', label: 'Small (12GB)', price: '€12' },
        { value: 'MEDIUM', label: 'Medium (70GB)', price: '€17' },
        { value: 'LARGE', label: 'Large (140GB)', price: '€22,50' },
        { value: 'UNLIMITED', label: 'Unlimited', price: '€33' },
      ];
    } else {
      // Zonder internet: standalone prijzen
      if (isMultiLine) {
        // 2+ lijnen zonder internet: ALLE lijnen krijgen deze prijs
        return [
          { value: 'SMALL', label: 'Small (12GB)', price: '€14' },
          { value: 'MEDIUM', label: 'Medium (70GB)', price: '€21' },
          { value: 'LARGE', label: 'Large (140GB)', price: '€26,50' },
          { value: 'UNLIMITED', label: 'Unlimited', price: '€37' },
        ];
      }
      // 1 lijn zonder internet
      return [
        { value: 'SMALL', label: 'Small (12GB)', price: '€15' },
        { value: 'MEDIUM', label: 'Medium (70GB)', price: '€23' },
        { value: 'LARGE', label: 'Large (140GB)', price: '€29' },
        { value: 'UNLIMITED', label: 'Unlimited', price: '€40' },
      ];
    }
  }
  
  // 2e, 3e, etc lijn: WEL Child optie
  if (hasInternet) {
    // 2+ lijnen in pack: deze prijzen gelden voor ALLE lijnen
    return [
      { value: 'CHILD', label: 'Child (3GB) - alleen als 2e/3e nummer', price: '€5' },
      { value: 'SMALL', label: 'Small (12GB)', price: '€11' },
      { value: 'MEDIUM', label: 'Medium (70GB)', price: '€15' },
      { value: 'LARGE', label: 'Large (140GB)', price: '€20' },
      { value: 'UNLIMITED', label: 'Unlimited', price: '€30' },
    ];
  } else {
    // 2+ lijnen zonder internet
    return [
      { value: 'CHILD', label: 'Child (3GB) - alleen als 2e/3e nummer', price: '€5' },
      { value: 'SMALL', label: 'Small (12GB)', price: '€14' },
      { value: 'MEDIUM', label: 'Medium (70GB)', price: '€21' },
      { value: 'LARGE', label: 'Large (140GB)', price: '€26,50' },
      { value: 'UNLIMITED', label: 'Unlimited', price: '€37' },
    ];
  }
};

const tvPlans = [
  { value: '', label: 'Geen TV' },
  { value: 'TV_LIFE', label: 'Orange TV Life (app) - €10' },
  { value: 'TV', label: 'Orange TV (met decoder) - €20' },
  { value: 'TV_PLUS', label: 'Orange TV Plus (Netflix) - €32' },
];

export function Step2Products({ data, onChange }: Step2ProductsProps) {
  const hasInternet = !!data.products.internet?.plan;
  const mobileCount = data.products.mobile.length;

  const addMobileLine = () => {
    const newLine = {
      plan: 'MEDIUM' as MobilePlan,
      isPortability: true,
      isSoHo: false,
    };
    onChange({
      products: {
        ...data.products,
        mobile: [...data.products.mobile, newLine],
      },
    });
  };

  const removeMobileLine = (index: number) => {
    const newMobile = data.products.mobile.filter((_, i) => i !== index);
    onChange({
      products: {
        ...data.products,
        mobile: newMobile,
      },
    });
  };

  const updateMobileLine = (index: number, updates: Partial<{ plan: MobilePlan; isPortability: boolean; isSoHo: boolean }>) => {
    const newMobile = [...data.products.mobile];
    newMobile[index] = { ...newMobile[index], ...updates } as MobileLine;
    onChange({
      products: {
        ...data.products,
        mobile: newMobile,
      },
    });
  };

  const isGiga = data.products.internet?.plan === 'GIGA';

  return (
    <div className="space-y-6">
      {/* Internet */}
      <Card className="p-5 border-2 border-orange-100">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Wifi className="w-5 h-5 mr-2 text-orange-500" />
          Internet
        </h3>
        
        <select
          className="w-full p-3 border rounded-lg bg-white mb-4"
          value={data.products.internet?.plan || ''}
          onChange={(e) =>
            onChange({
              products: {
                ...data.products,
                internet: e.target.value
                  ? {
                      plan: e.target.value as InternetPlan,
                      isSecondAddress: data.products.internet?.isSecondAddress || false,
                      hasEasySwitch: data.products.internet?.hasEasySwitch || false,
                    }
                  : undefined,
              },
            })
          }
        >
          {internetPlans.map((plan) => (
            <option key={plan.value} value={plan.value}>
              {plan.label} {plan.price && `- ${plan.price}`}
            </option>
          ))}
        </select>

        {hasInternet && (
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.products.internet?.isSecondAddress || false}
                  onChange={(e) =>
                    onChange({
                      products: {
                        ...data.products,
                        internet: {
                          ...data.products.internet!,
                          isSecondAddress: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 text-orange-600"
                />
                <div>
                  <div className="font-medium">2de Adres</div>
                  <div className="text-sm text-gray-500">-€10 korting op internet</div>
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.products.internet?.hasEasySwitch || false}
                  onChange={(e) =>
                    onChange({
                      products: {
                        ...data.products,
                        internet: {
                          ...data.products.internet!,
                          hasEasySwitch: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 text-orange-600"
                />
                <div>
                  <div className="font-medium">Easy Switch</div>
                  <div className="text-sm text-gray-500">Behoud je nummer zonder technieker</div>
                </div>
              </div>
            </label>
          </div>
        )}
      </Card>

      {/* Mobile */}
      <Card className="p-5 border-2 border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-blue-500" />
            Mobiel
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMobileLine}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            GSM toevoegen
          </Button>
        </div>

        {data.products.mobile.length === 0 && (
          <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
            <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Klik "GSM toevoegen" om mobiele lijnen toe te voegen</p>
          </div>
        )}

        <div className="space-y-4">
          {data.products.mobile.map((line, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-blue-700">GSM #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMobileLine(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Verwijder
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm mb-1 block">Plan</Label>
                  <select
                    className="w-full p-2 border rounded bg-white"
                    value={line.plan}
                    onChange={(e) => updateMobileLine(index, { plan: e.target.value })}
                  >
                    {getMobilePlans(index, hasInternet, mobileCount).map((plan) => (
                      <option key={plan.value} value={plan.value}>
                        {plan.label} - {plan.price}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center space-x-2 p-2 bg-white rounded border cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={line.isPortability}
                    onChange={(e) => updateMobileLine(index, { isPortability: e.target.checked })}
                  />
                  <div className="text-sm">
                    <div className="font-medium">Nummeroverdracht</div>
                    <div className="text-gray-500">Behoud je huidige nummer</div>
                  </div>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded border cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={line.isSoHo}
                    onChange={(e) => updateMobileLine(index, { isSoHo: e.target.checked })}
                  />
                  <div className="text-sm">
                    <div className="font-medium">SoHo</div>
                    <div className="text-gray-500">Zakelijke gebruiker (BTW nummer)</div>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        {data.products.mobile.length >= 2 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <span className="text-lg mr-2">✓</span>
              <div>
                <strong>Multi-line korting toegepast!</strong>
                <div className="text-sm">
                  {data.products.mobile.length} GSM lijnen - <strong>alle lijnen</strong> krijgen de 2+ prijs
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* TV */}
      <Card className="p-5 border-2 border-purple-100">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Tv className="w-5 h-5 mr-2 text-purple-500" />
          TV (optioneel)
        </h3>
        
        <select
          className="w-full p-3 border rounded-lg bg-white"
          value={data.products.tv || ''}
          onChange={(e) =>
            onChange({
              products: {
                ...data.products,
                tv: e.target.value === '' ? null : (e.target.value as TVPlan),
              },
            })
          }
        >
          {tvPlans.map((plan) => (
            <option key={plan.value} value={plan.value}>
              {plan.label}
            </option>
          ))}
        </select>
      </Card>

      {/* Add-ons */}
      <Card className="p-5 border-2 border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Extra's</h3>
        
        <div className="space-y-4">
          {/* My Comfort / WiFi */}
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <div>
              <div className="font-medium">My Comfort</div>
              <div className="text-sm text-gray-500">
                {isGiga ? '€5/maand (korting bij Giga)' : '€10/maand'}
              </div>
            </div>
            <Switch
              checked={data.hasMyComfort}
              onCheckedChange={(checked) => onChange({ hasMyComfort: checked })}
            />
          </label>

          {/* WiFi Boosters */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="mb-2 block">WiFi Boosters - €3/maand per stuk</Label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={data.wifiBoosters}
              onChange={(e) => onChange({ wifiBoosters: parseInt(e.target.value) })}
            >
              <option value={0}>Geen</option>
              <option value={1}>1 Booster - €3/maand</option>
              <option value={2}>2 Boosters - €6/maand</option>
              <option value={3}>3 Boosters - €9/maand</option>
            </select>
          </div>

          {/* Vaste Lijn */}
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <div>
              <div className="font-medium">Vaste Lijn</div>
              <div className="text-sm text-gray-500">€12/maand</div>
            </div>
            <Switch
              checked={data.hasVasteLijn || false}
              onCheckedChange={(checked) => onChange({ hasVasteLijn: checked })}
            />
          </label>

          {/* Extra Decoder */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="mb-2 block">Extra Decoder - €9/maand</Label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={data.extraDecoders || 0}
              onChange={(e) => onChange({ extraDecoders: parseInt(e.target.value) })}
            >
              <option value={0}>Geen</option>
              <option value={1}>1 Extra Decoder - €9/maand</option>
              <option value={2}>2 Extra Decoders - €18/maand</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Kortingen info - alleen voor klant zichtbare kortingen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💰 Bespaar meer</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Multi-line korting: korting op mobiele abonnementen bij 2+ lijnen</li>
          <li>• Pack korting: extra korting op internet wanneer je ook mobiel neemt</li>
          <li>• 2de adres: €10 korting op je internetprijs</li>
          <li>• My Comfort: €5/maand bij Giga Fiber (normaal €10)</li>
        </ul>
      </div>
    </div>
  );
}
