'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuoteResult } from '@/lib/quote-wizard';
import { QuoteWizardInput } from '@/lib/quote-wizard';
import { Mail, MessageCircle, Download, Check, Loader2, Copy } from 'lucide-react';

interface Step4SendProps {
  quote: QuoteResult;
  formData: QuoteWizardInput;
}

export function Step4Send({ quote, formData }: Step4SendProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [copied, setCopied] = useState(false);

  // WhatsApp bericht genereren
  const whatsappMessage = `Hallo ${formData.customerName.split(' ')[0]}!

Hier is je persoonlijke offerte van SmartSN:

💰 Nieuw maandbedrag: ${quote.customer.monthlyTotal}
💰 Jouw besparing: ${quote.customer.monthlySavings}/maand
📊 6 maanden: ${quote.customer.savings6Months} bespaard

Offerte nummer: ${quote.quoteId}
Geldig tot: ${quote.pdfData.validUntil}

Vragen? Bel me gerust! 📞

Groeten,
SmartSN Consultant`;

  const handleSendEmail = async () => {
    if (!formData.customerEmail) {
      alert('Geen email adres ingevuld. Ga terug naar stap 1.');
      return;
    }

    setEmailStatus('sending');
    
    try {
      const response = await fetch('/api/email/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.customerEmail,
          quote: quote,
          customerName: formData.customerName,
        }),
      });

      if (response.ok) {
        setEmailStatus('sent');
        // Start follow-up sequence
        await fetch('/api/sequences/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'QUOTE_SENT',
            leadId: quote.quoteId,
          }),
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Er is een fout opgetreden bij het verzenden van de email.');
      setEmailStatus('idle');
    }
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const phone = formData.customerPhone?.replace(/\s/g, '') || '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF download komt binnenkort beschikbaar!');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-green-800">Offerte Gegenereerd!</h3>
        <p className="text-green-700">
          Offerte nummer: <strong>{quote.quoteId}</strong>
        </p>
      </div>

      {/* Summary */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-3">Samenvatting</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Klant:</span>
            <div className="font-medium">{formData.customerName}</div>
          </div>
          <div>
            <span className="text-gray-600">Nieuw maandbedrag:</span>
            <div className="font-medium text-green-600">{quote.customer.monthlyTotal}</div>
          </div>
          <div>
            <span className="text-gray-600">Jouw commissie:</span>
            <div className="font-medium text-orange-600">{quote.consultant.immediateCommission}</div>
          </div>
          <div>
            <span className="text-gray-600">Geldig tot:</span>
            <div className="font-medium">{quote.pdfData.validUntil}</div>
          </div>
        </div>
      </Card>

      {/* Send Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Option */}
        <Card className="p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-semibold">Verstuur per Email</h4>
          </div>

          {formData.customerEmail ? (
            <>
              <p className="text-sm text-gray-600 mb-3 text-center">
                Naar: {formData.customerEmail}
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSendEmail}
                disabled={emailStatus === 'sending' || emailStatus === 'sent'}
              >
                {emailStatus === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verzenden...
                  </>
                ) : emailStatus === 'sent' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Verzonden!
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Verstuur Email
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Geen email adres ingevuld
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => alert('Ga terug naar stap 1 om een email adres toe te voegen')}
              >
                Ga naar Stap 1
              </Button>
            </div>
          )}
        </Card>

        {/* WhatsApp Option */}
        <Card className="p-6 border-2 border-green-200 hover:border-green-400 transition-colors">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-semibold">Deel via WhatsApp</h4>
          </div>

          {formData.customerPhone ? (
            <>
              <p className="text-sm text-gray-600 mb-3 text-center">
                Naar: {formData.customerPhone}
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyWhatsApp}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Gekopieerd!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Kopieer bericht
                    </>
                  )}
                </Button>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleOpenWhatsApp}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open WhatsApp
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Geen telefoonnummer ingevuld
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => alert('Ga terug naar stap 1 om een telefoonnummer toe te voegen')}
              >
                Ga naar Stap 1
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* WhatsApp Preview */}
      <Card className="p-4 bg-green-50">
        <h4 className="font-semibold mb-2 flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp Bericht Preview
        </h4>
        <pre className="text-sm bg-white p-3 rounded border whitespace-pre-wrap font-sans">
          {whatsappMessage}
        </pre>
      </Card>

      {/* Download PDF */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleDownloadPDF}
          className="px-6"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF (binnenkort)
        </Button>
      </div>

      {/* Follow-up Info */}
      {emailStatus === 'sent' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            ✅ Automatische opvolging gepland!
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Dag 1: Herinneringsmail wordt automatisch verstuurd</li>
            <li>• Dag 3: WhatsApp herinnering in je takenlijst</li>
            <li>• Dag 7: Call taak om op te volgen</li>
          </ul>
        </div>
      )}
    </div>
  );
}
