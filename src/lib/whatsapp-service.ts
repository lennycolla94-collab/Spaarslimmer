export type MessageType = 'quote_reminder' | 'followup' | 'welcome' | 'activation_check';

export interface WhatsAppMessageData {
  leadName: string;
  companyName: string;
  consultantName: string;
  quoteId?: string;
  savingsAmount?: number;
  productType?: string;
}

/**
 * Generate WhatsApp message template based on type
 */
function generateMessageTemplate(type: MessageType, data: WhatsAppMessageData): string {
  const baseGreeting = `Hallo ${data.leadName}`;
  
  switch (type) {
    case 'quote_reminder':
      return `${baseGreeting},%0A%0A` +
        `Hierbij een vriendelijke herinnering aan uw offerte van SmartSN voor ${data.companyName}.%0A%0A` +
        `💰 Mogelijke besparing: €${data.savingsAmount?.toFixed(2) || '0'} in 6 maanden%0A` +
        `📋 Offertenummer: ${data.quoteId || 'Onbekend'}%0A%0A` +
        `Heeft u vragen of wilt u akkoord gaan? Stuur mij gerust een bericht!%0A%0A` +
        `Met vriendelijke groet,%0A` +
        `${data.consultantName}%0A` +
        `SmartSN Consultant`;

    case 'followup':
      return `${baseGreeting},%0A%0A` +
        `Ik hoop dat alles goed gaat met ${data.companyName}.%0A%0A` +
        `Ik wilde even nagaan of u nog interesse heeft in onze ${data.productType || 'diensten'}. ` +
        `We kunnen u nog steeds helpen besparen op uw maandelijkse kosten.%0A%0A` +
        `Kunt u mij laten weten of u nog wilt verdergaan?%0A%0A` +
        `Met vriendelijke groet,%0A` +
        `${data.consultantName}`;

    case 'welcome':
      return `${baseGreeting},%0A%0A` +
        `Welkom bij SmartSN! 🎉%0A%0A` +
        `Bedankt dat u voor ons heeft gekozen voor ${data.companyName}. ` +
        `Ik ben ${data.consultantName}, uw persoonlijke consultant.%0A%0A` +
        `Mocht u vragen hebben, u kunt mij altijd bereiken via dit nummer.%0A%0A` +
        `Tot snel!`;

    case 'activation_check':
      return `${baseGreeting},%0A%0A` +
        `Ik wilde even nagaan of alles naar wens verloopt met uw ${data.productType || 'diensten'} bij ${data.companyName}.%0A%0A` +
        `Loopt de eerste factuur goed? ` +
        `Laat het me weten als u vragen heeft!%0A%0A` +
        `Met vriendelijke groet,%0A` +
        `${data.consultantName}`;

    default:
      return `${baseGreeting},%0A%0A` +
        `Bedankt voor uw interesse in SmartSN.%0A%0A` +
        `Met vriendelijke groet,%0A` +
        `${data.consultantName}`;
  }
}

/**
 * Format phone number for WhatsApp (international format without +)
 */
function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle Belgian numbers
  if (cleaned.startsWith('0')) {
    cleaned = '32' + cleaned.substring(1);
  }
  
  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Generate WhatsApp click-to-chat link
 */
export function generateWhatsAppLink(
  phone: string,
  messageType: MessageType,
  data: WhatsAppMessageData
): { link: string; message: string } {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const message = generateMessageTemplate(messageType, data);
  
  // wa.me format: https://wa.me/{phone}?text={message}
  const link = `https://wa.me/${formattedPhone}?text=${message}`;
  
  return {
    link,
    message: decodeURIComponent(message),
  };
}

/**
 * Generate WhatsApp link for quick quote sharing
 */
export function generateQuickQuoteLink(
  phone: string,
  leadName: string,
  quoteId: string,
  savings: number,
  consultantName: string
): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const message = `Hallo ${leadName},%0A%0A` +
    `Uw SmartSN offerte (${quoteId}) staat voor u klaar!%0A` +
    `💰 Besparing: €${savings.toFixed(2)} in 6 maanden%0A%0A` +
    `Klik hier om akkoord te gaan of met vragen:%0A` +
    `[LINK_NAAR_OFFERTE]%0A%0A` +
    `${consultantName}`;
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

/**
 * Check if phone number is valid for WhatsApp
 */
export function isValidWhatsAppNumber(phone: string): boolean {
  const formatted = formatPhoneForWhatsApp(phone);
  // WhatsApp numbers should be at least 10 digits (country code + number)
  return formatted.length >= 10 && formatted.length <= 15;
}

/**
 * Generate WhatsApp business API payload (for future API integration)
 */
export function generateWhatsAppApiPayload(
  phone: string,
  messageType: MessageType,
  data: WhatsAppMessageData
): {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text';
  text: { body: string };
} {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatPhoneForWhatsApp(phone),
    type: 'text',
    text: {
      body: generateMessageTemplate(messageType, data).replace(/%0A/g, '\n'),
    },
  };
}
