'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Calculator, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CalculationResult {
  success: boolean;
  data?: {
    consultant: {
      baseRetail: number;
      portabilityBonus: number;
      convergenceBonus: number;
      bonusesTotal: number;
      aspValue: number;
      fidelityMonthly: number;
      grossTotal: number;
      uplineCost: number;
      netTotal: number;
    };
    upline: {
      payouts: Array<{
        userId: string;
        level: number;
        percentage: number;
        amount: number;
      }>;
      totalCost: number;
    };
    clawback: {
      status: 'SAFE' | 'MEDIUM_RISK' | 'HIGH_RISK';
      atRiskPercentage: number;
      potentialLoss: number;
    };
    breakdown: {
      bc: number;
      sc: number;
      productName: string;
    };
  };
  error?: string;
}

export function CalculatorWidget() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // Form state
  const [productType, setProductType] = useState<'MOBILE' | 'INTERNET' | 'ENERGIE'>('MOBILE');
  const [productId, setProductId] = useState('');
  
  // Options
  const [isPortability, setIsPortability] = useState(false);
  const [isConvergence, setIsConvergence] = useState(false);
  const [isSoHo, setIsSoHo] = useState(false);
  const [hasEBilling, setHasEBilling] = useState(false);
  const [hasDomiciliering, setHasDomiciliering] = useState(false);
  
  // Validation
  const [isInternalMigration, setIsInternalMigration] = useState(false);
  const [isWithin3Months, setIsWithin3Months] = useState(false);

  const handleCalculate = async () => {
    if (!productId) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          productId,
          options: {
            isPortability,
            isConvergence,
            isSoHo,
            hasEBilling,
            hasDomiciliering,
            monthsActive: 0,
          },
          validation: {
            isInternalMigration,
            isWithin3Months,
            hasActiveService: true,
          },
          upline: [
            { userId: 'upline-1', level: 1 }, // Dummy upline voor test
          ],
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Netwerk fout',
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductOptions = () => {
    switch (productType) {
      case 'MOBILE':
        return ['ORANGE_CHILD', 'ORANGE_SMALL', 'ORANGE_MEDIUM', 'ORANGE_LARGE', 'ORANGE_UNLIMITED'];
      case 'INTERNET':
        return ['EASY_INTERNET_HOME', 'ORANGE_TV', 'ORANGE_TV_LITE', 'EASY_INTERNET_SOHO'];
      case 'ENERGIE':
        return ['ENECO_RESIDENTIEEL_HOME', 'ENECO_SOHO_HOME', 'KETELONDERHOUD'];
      default:
        return [];
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Commissie Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Product Type */}
        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select value={productType} onValueChange={(v: any) => {
            setProductType(v);
            setProductId('');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Kies type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MOBILE">Mobiel</SelectItem>
              <SelectItem value="INTERNET">Internet/TV</SelectItem>
              <SelectItem value="ENERGIE">Energie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product ID */}
        <div className="space-y-2">
          <Label>Product</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Kies product" />
            </SelectTrigger>
            <SelectContent>
              {getProductOptions().map(id => (
                <SelectItem key={id} value={id}>
                  {id.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center space-x-2">
            <Switch id="portability" checked={isPortability} onCheckedChange={setIsPortability} />
            <Label htmlFor="portability" className="text-sm">Portabiliteit</Label>
          </div>
          
          {productType === 'INTERNET' && (
            <div className="flex items-center space-x-2">
              <Switch id="convergence" checked={isConvergence} onCheckedChange={setIsConvergence} />
              <Label htmlFor="convergence" className="text-sm">Convergentie</Label>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch id="soho" checked={isSoHo} onCheckedChange={setIsSoHo} />
            <Label htmlFor="soho" className="text-sm">SoHo</Label>
          </div>
          
          {productType === 'ENERGIE' && (
            <>
              <div className="flex items-center space-x-2">
                <Switch id="ebilling" checked={hasEBilling} onCheckedChange={setHasEBilling} />
                <Label htmlFor="ebilling" className="text-sm">eBilling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="domiciliering" checked={hasDomiciliering} onCheckedChange={setHasDomiciliering} />
                <Label htmlFor="domiciliering" className="text-sm">Domiciliëring</Label>
              </div>
            </>
          )}
        </div>

        {/* Validation Alerts */}
        <div className="space-y-2 border-t pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Validatie Checks</p>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="internal" className="text-sm text-red-600">Interne migratie</Label>
            <Switch id="internal" checked={isInternalMigration} onCheckedChange={setIsInternalMigration} />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="3months" className="text-sm text-red-600">Binnen 3 maanden</Label>
            <Switch id="3months" checked={isWithin3Months} onCheckedChange={setIsWithin3Months} />
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={handleCalculate} 
          disabled={loading || !productId}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Berekenen...
            </>
          ) : (
            'Bereken Commissie'
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-3 pt-4 border-t">
            {!result.success ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {result.error || 'Berekening mislukt'}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {/* Success Alert */}
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>{result.data?.breakdown.productName}</strong><br />
                    BC: €{result.data?.breakdown.bc} | SC: €{result.data?.breakdown.sc}
                  </AlertDescription>
                </Alert>

                {/* Commission Breakdown */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Basis Retail:</span>
                    <span className="font-medium">€{result.data?.consultant.baseRetail}</span>
                  </div>
                  
                  {(result.data?.consultant.portabilityBonus || 0) > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>+ Portability:</span>
                      <span>€{result.data?.consultant.portabilityBonus}</span>
                    </div>
                  )}
                  
                  {(result.data?.consultant.convergenceBonus || 0) > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>+ Convergentie:</span>
                      <span>€{result.data?.consultant.convergenceBonus}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>ASP:</span>
                    <span>{result.data?.consultant.aspValue} punten</span>
                  </div>
                  
                  <div className="flex justify-between text-purple-600">
                    <span>Fidelity (maand):</span>
                    <span>€{result.data?.consultant.fidelityMonthly}</span>
                  </div>

                  <div className="border-t pt-2 flex justify-between text-red-600">
                    <span>- Upline ({result.data?.upline.payouts.length} niveaus):</span>
                    <span>€{result.data?.consultant.uplineCost}</span>
                  </div>

                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>NETTO:</span>
                    <span className="text-green-600">€{result.data?.consultant.netTotal}</span>
                  </div>
                </div>

                {/* Clawback Warning */}
                {result.data?.clawback.status !== 'SAFE' && (
                  <Alert variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription>
                      Clawback risico: {result.data?.clawback.atRiskPercentage}% 
                      (€{result.data?.clawback.potentialLoss} potentieel verlies)
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
