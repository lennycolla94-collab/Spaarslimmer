'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuoteWizardInput } from '@/lib/quote-wizard';
import { calculateTariff } from '@/lib/tariff-engine';
import { formatEuro } from '@/lib/calculator';
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react';

interface Step3SummaryProps {
  data: QuoteWizardInput;
  onGenerate: () => void;
  loading: boolean;
}

export function Step3Summary({ data, onGenerate, loading }: Step3SummaryProps) {
  // Client-side preview berekening - alleen tarieven voor klant
  const tariffResult = useMemo(() => {
    return calculateTariff({
      internetPlan: data.products.internet?.plan || 'START',
      isSecondAddress: data.products.internet?.isSecondAddress || false,
      hasMobile: data.products.mobile.length > 0,
      mobileLines: data.products.mobile.map((m) => ({
        plan: m.plan,
        isPortability: m.isPortability,
        isNewNumber: !m.isPortability,
      })),
      tvPlan: data.products.tv || 'NONE',
      hasVasteLijn: data.hasVasteLijn || false,
      hasMyComfort: data.hasMyComfort,
      wifiBoosters: data.wifiBoosters,
      extraDecoders: data.extraDecoders || 0,
      currentMonthlyCost: data.currentMonthlyCost,
    });
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Klant Besparing */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2" />
          Klant Besparing
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Huidig</div>
            <div className="text-xl font-bold text-gray-800">
              {formatEuro(data.currentMonthlyCost * 100)}
            </div>
            <div className="text-xs text-gray-500">/maand</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Nieuw</div>
            <div className="text-xl font-bold text-green-600">
              {formatEuro(tariffResult.totalMonthly)}
            </div>
            <div className="text-xs text-gray-500">/maand</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Besparing</div>
            <div className="text-xl font-bold text-green-600">
              {formatEuro((data.currentMonthlyCost * 100) - tariffResult.totalMonthly)}
            </div>
            <div className="text-xs text-gray-500">/maand</div>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-sm text-green-700">Op 6 maanden</div>
            <div className="text-2xl font-bold text-green-800">
              {tariffResult.formatted.savings6Months}
            </div>
            <div className="text-xs text-green-600">totaal bespaard</div>
          </div>
        </div>
        
        {tariffResult.savings24Months && (
          <div className="mt-4 p-3 bg-green-100 rounded text-center">
            <span className="text-green-800">
              Over <strong>2 jaar</strong> bespaart de klant{' '}
              <strong>{tariffResult.formatted.savings24Months}</strong>
            </span>
          </div>
        )}
      </Card>

      {/* Product Overzicht */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Gekozen Producten</h4>
        <div className="space-y-2">
          {data.products.internet?.plan && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">
                Internet {data.products.internet.plan === 'START' && 'Start Fiber'}
                {data.products.internet.plan === 'ZEN' && 'Zen Fiber'}
                {data.products.internet.plan === 'GIGA' && 'Giga Fiber'}
              </span>
              <span className="font-semibold">{formatEuro(tariffResult.internetPrice)}</span>
            </div>
          )}
          
          {data.products.mobile.map((line, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
              <span className="text-gray-700">
                Mobiel {index + 1}: {line.plan === 'CHILD' && 'Child (3GB)'}
                {line.plan === 'SMALL' && 'Small (12GB)'}
                {line.plan === 'MEDIUM' && 'Medium (70GB)'}
                {line.plan === 'LARGE' && 'Large (140GB)'}
                {line.plan === 'UNLIMITED' && 'Unlimited'}
                {line.isPortability && ' + nummerbehoud'}
              </span>
            </div>
          ))}
          
          {data.products.tv && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">
                TV {data.products.tv === 'TV_LIFE' && 'Life (App)'}
                {data.products.tv === 'TV' && '(met decoder)'}
                {data.products.tv === 'TV_PLUS' && 'Plus (Netflix)'}
              </span>
              <span className="font-semibold">{formatEuro(tariffResult.tvPrice)}</span>
            </div>
          )}
          
          {tariffResult.addonsPrice > 0 && (
            <div className="flex justify-between items-center py-2 border-b last:border-0">
              <span className="text-gray-700">Extra&apos;s</span>
              <span className="font-semibold">{formatEuro(tariffResult.addonsPrice)}</span>
            </div>
          )}
          
          {tariffResult.secondAddressDiscount > 0 && (
            <div className="flex justify-between items-center py-2 border-b last:border-0 text-green-600">
              <span>2de adres korting</span>
              <span className="font-semibold">-{formatEuro(tariffResult.secondAddressDiscount)}</span>
            </div>
          )}
        </div>
      </Card>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Offerte genereren...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 mr-2" />
              Genereer Offerte & Ga naar Versturen →
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Dit maakt de offerte aan en opent de verzendopties
        </p>
      </div>
    </div>
  );
}
