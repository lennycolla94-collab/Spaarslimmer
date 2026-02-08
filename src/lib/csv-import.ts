import Papa from 'papaparse';

export interface LeadImportData {
  companyName: string;
  niche: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  province: string;
  currentProvider?: string;
  currentSupplier?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  leads: LeadImportData[];
}

/**
 * Validate Belgian phone number
 */
export function isValidBelgianPhone(phone: string): boolean {
  // Remove all non-numeric characters except + for international format
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
  
  // Belgian numbers can be:
  // - Mobile: 04xx xxx xxx or +324xx xxx xxx
  // - Landline: 0x xxx xx xx or +32x xxx xx xx
  
  const patterns = [
    /^04\d{8}$/,           // Mobile: 04xxxxxxxx
    /^0\d{8}$/,            // Landline: 0xxxxxxxx
    /^\+324\d{8}$/,        // International mobile: +324xxxxxxxx
    /^\+32\d{8,9}$/,       // International: +32xxxxxxxx
    /^00324\d{8}$/,        // Old format mobile: 00324xxxxxxxx
    /^0032\d{8,9}$/,       // Old format: 0032xxxxxxxx
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Normalize phone number to standard format
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
  
  // Convert to international format
  if (cleaned.startsWith('00')) {
    return '+' + cleaned.substring(2);
  }
  if (cleaned.startsWith('0')) {
    return '+32' + cleaned.substring(1);
  }
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  return cleaned;
}

/**
 * Map CSV columns to LeadImportData
 */
function mapColumns(row: any): LeadImportData {
  // Try different possible column names
  const getValue = (...keys: string[]): string | undefined => {
    for (const key of keys) {
      // Try exact match first
      if (row[key] !== undefined && row[key] !== '') {
        return row[key].trim();
      }
      // Try case-insensitive match
      const lowerKey = key.toLowerCase();
      const matchingKey = Object.keys(row).find(k => k.toLowerCase() === lowerKey);
      if (matchingKey && row[matchingKey] !== '' && row[matchingKey] !== undefined) {
        return row[matchingKey].trim();
      }
    }
    return undefined;
  };

  const companyName = getValue('Bedrijfsnaam', 'Company', 'Bedrijf', 'Naam');
  if (!companyName) {
    throw new Error('Missing required field: Bedrijfsnaam');
  }

  const phone = getValue('Telefoon', 'Phone', 'Gsm', 'Mobiel', 'Tel');
  if (!phone) {
    throw new Error('Missing required field: Telefoon');
  }

  const province = getValue('Provincie', 'Province', 'Prov');
  if (!province) {
    throw new Error('Missing required field: Provincie');
  }

  return {
    companyName,
    niche: getValue('Niche', 'Sector', 'Category', 'Categorie') || 'zelfstandigen',
    phone: normalizePhone(phone),
    email: getValue('Email', 'E-mail', 'Mail', 'E-mailadres'),
    address: getValue('Adres', 'Address', 'Straat'),
    city: getValue('Gemeente', 'City', 'Stad', 'Plaats'),
    province,
    currentProvider: getValue('Huidige Provider', 'Provider', 'Huidigeprovider', 'Telecom'),
    currentSupplier: getValue('Huidige Leverancier', 'Leverancier', 'Supplier', 'Energieleverancier'),
  };
}

/**
 * Parse CSV file buffer
 */
export async function parseCSV(fileBuffer: Buffer): Promise<LeadImportData[]> {
  const csvString = fileBuffer.toString('utf-8');
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';', // Common in European CSVs
      complete: (results) => {
        try {
          const leads: LeadImportData[] = [];
          const errors: string[] = [];
          
          for (let i = 0; i < results.data.length; i++) {
            try {
              const row = results.data[i] as any;
              const lead = mapColumns(row);
              
              // Validate phone number
              if (!isValidBelgianPhone(lead.phone)) {
                errors.push(`Row ${i + 2}: Invalid phone number "${lead.phone}" for ${lead.companyName}`);
                continue;
              }
              
              // Validate email if provided
              if (lead.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(lead.email)) {
                  errors.push(`Row ${i + 2}: Invalid email "${lead.email}" for ${lead.companyName}`);
                  continue;
                }
              }
              
              leads.push(lead);
            } catch (error) {
              errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
          
          if (errors.length > 0 && leads.length === 0) {
            reject(new Error(`Import failed: ${errors.join('; ')}`));
          } else {
            resolve(leads);
          }
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

/**
 * Parse CSV with deduplication check
 */
export async function parseCSVWithDedup(
  fileBuffer: Buffer,
  existingPhones: Set<string>
): Promise<{ leads: LeadImportData[]; duplicates: string[] }> {
  const allLeads = await parseCSV(fileBuffer);
  
  const leads: LeadImportData[] = [];
  const duplicates: string[] = [];
  
  for (const lead of allLeads) {
    const normalizedPhone = normalizePhone(lead.phone);
    if (existingPhones.has(normalizedPhone)) {
      duplicates.push(`${lead.companyName} (${lead.phone})`);
    } else {
      leads.push(lead);
      existingPhones.add(normalizedPhone);
    }
  }
  
  return { leads, duplicates };
}

/**
 * Validate import data
 */
export function validateImportData(leads: LeadImportData[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenPhones = new Set<string>();
  
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    
    // Check for duplicates within the import file
    if (seenPhones.has(lead.phone)) {
      errors.push(`Duplicate phone number "${lead.phone}" for ${lead.companyName} (row ${i + 2})`);
    } else {
      seenPhones.add(lead.phone);
    }
    
    // Validate required fields
    if (!lead.companyName || lead.companyName.trim() === '') {
      errors.push(`Missing company name (row ${i + 2})`);
    }
    
    if (!lead.phone || !isValidBelgianPhone(lead.phone)) {
      errors.push(`Invalid phone number "${lead.phone}" for ${lead.companyName} (row ${i + 2})`);
    }
    
    if (!lead.province || lead.province.trim() === '') {
      errors.push(`Missing province for ${lead.companyName} (row ${i + 2})`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
