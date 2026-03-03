/**
 * Phone Validation Utility
 * 
 * Validates phone numbers for the most popular countries with proper formatting rules
 */

export type CountryCode = 
  | 'RO' // România
  | 'US' // United States
  | 'GB' // United Kingdom
  | 'DE' // Germany
  | 'FR' // France
  | 'IT' // Italy
  | 'ES' // Spain
  | 'NL' // Netherlands
  | 'BE' // Belgium
  | 'AT' // Austria
  | 'CH' // Switzerland
  | 'SE' // Sweden
  | 'NO' // Norway
  | 'DK' // Denmark
  | 'FI' // Finland
  | 'PL' // Poland
  | 'CZ' // Czech Republic
  | 'HU' // Hungary
  | 'GR' // Greece
  | 'PT' // Portugal
  | 'IE' // Ireland
  | 'CA' // Canada
  | 'AU' // Australia
  | 'NZ' // New Zealand
  | 'JP' // Japan
  | 'CN' // China
  | 'IN' // India
  | 'BR' // Brazil
  | 'MX' // Mexico
  | 'AR' // Argentina;

interface PhoneValidationRule {
  country: string;
  countryCode: string;
  pattern: RegExp;
  minLength: number;
  maxLength: number;
  format: string;
  example: string;
}

/**
 * Phone validation rules for popular countries
 * Each rule includes:
 * - country: Full country name
 * - countryCode: International dialing code
 * - pattern: Regex pattern for validation
 * - minLength/maxLength: Length constraints (excluding country code)
 * - format: Expected format description
 * - example: Valid phone number example
 */
export const PHONE_VALIDATION_RULES: Record<CountryCode, PhoneValidationRule> = {
  RO: {
    country: 'România',
    countryCode: '+40',
    pattern: /^(\+?40|0)?[27]\d{8}$/,
    minLength: 9,
    maxLength: 10,
    format: '07XXXXXXXX sau +40 7XX XXX XXX',
    example: '+40 722 123 456',
  },
  US: {
    country: 'United States',
    countryCode: '+1',
    pattern: /^(\+?1)?[2-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    format: '(XXX) XXX-XXXX',
    example: '+1 (555) 123-4567',
  },
  GB: {
    country: 'United Kingdom',
    countryCode: '+44',
    pattern: /^(\+?44|0)?[1-9]\d{9,10}$/,
    minLength: 10,
    maxLength: 11,
    format: '07XXX XXXXXX',
    example: '+44 7700 900123',
  },
  DE: {
    country: 'Germany',
    countryCode: '+49',
    pattern: /^(\+?49|0)?[1-9]\d{9,11}$/,
    minLength: 10,
    maxLength: 12,
    format: '0XXX XXXXXXX',
    example: '+49 151 12345678',
  },
  FR: {
    country: 'France',
    countryCode: '+33',
    pattern: /^(\+?33|0)?[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '0X XX XX XX XX',
    example: '+33 6 12 34 56 78',
  },
  IT: {
    country: 'Italy',
    countryCode: '+39',
    pattern: /^(\+?39)?[3]\d{8,9}$/,
    minLength: 9,
    maxLength: 10,
    format: '3XX XXX XXXX',
    example: '+39 320 1234567',
  },
  ES: {
    country: 'Spain',
    countryCode: '+34',
    pattern: /^(\+?34)?[6-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '6XX XXX XXX',
    example: '+34 612 345 678',
  },
  NL: {
    country: 'Netherlands',
    countryCode: '+31',
    pattern: /^(\+?31|0)?[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '06 XXXXXXXX',
    example: '+31 6 12345678',
  },
  BE: {
    country: 'Belgium',
    countryCode: '+32',
    pattern: /^(\+?32|0)?[4-9]\d{7,8}$/,
    minLength: 8,
    maxLength: 9,
    format: '04XX XX XX XX',
    example: '+32 470 12 34 56',
  },
  AT: {
    country: 'Austria',
    countryCode: '+43',
    pattern: /^(\+?43|0)?[1-9]\d{9,10}$/,
    minLength: 10,
    maxLength: 11,
    format: '06XX XXXXXXX',
    example: '+43 664 1234567',
  },
  CH: {
    country: 'Switzerland',
    countryCode: '+41',
    pattern: /^(\+?41|0)?[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '07X XXX XX XX',
    example: '+41 76 123 45 67',
  },
  SE: {
    country: 'Sweden',
    countryCode: '+46',
    pattern: /^(\+?46|0)?[1-9]\d{8,9}$/,
    minLength: 9,
    maxLength: 10,
    format: '07X XXX XX XX',
    example: '+46 70 123 45 67',
  },
  NO: {
    country: 'Norway',
    countryCode: '+47',
    pattern: /^(\+?47)?[4-9]\d{7}$/,
    minLength: 8,
    maxLength: 8,
    format: 'XXX XX XXX',
    example: '+47 412 34 567',
  },
  DK: {
    country: 'Denmark',
    countryCode: '+45',
    pattern: /^(\+?45)?[2-9]\d{7}$/,
    minLength: 8,
    maxLength: 8,
    format: 'XX XX XX XX',
    example: '+45 20 12 34 56',
  },
  FI: {
    country: 'Finland',
    countryCode: '+358',
    pattern: /^(\+?358|0)?[4-9]\d{7,9}$/,
    minLength: 8,
    maxLength: 10,
    format: '04X XXX XXXX',
    example: '+358 40 123 4567',
  },
  PL: {
    country: 'Poland',
    countryCode: '+48',
    pattern: /^(\+?48)?[4-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: 'XXX XXX XXX',
    example: '+48 501 234 567',
  },
  CZ: {
    country: 'Czech Republic',
    countryCode: '+420',
    pattern: /^(\+?420)?[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: 'XXX XXX XXX',
    example: '+420 601 234 567',
  },
  HU: {
    country: 'Hungary',
    countryCode: '+36',
    pattern: /^(\+?36)?[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '06 XX XXX XXXX',
    example: '+36 20 123 4567',
  },
  GR: {
    country: 'Greece',
    countryCode: '+30',
    pattern: /^(\+?30)?[2-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    format: '6XX XXX XXXX',
    example: '+30 690 1234567',
  },
  PT: {
    country: 'Portugal',
    countryCode: '+351',
    pattern: /^(\+?351)?[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '9XX XXX XXX',
    example: '+351 912 345 678',
  },
  IE: {
    country: 'Ireland',
    countryCode: '+353',
    pattern: /^(\+?353|0)?[1-9]\d{8,9}$/,
    minLength: 9,
    maxLength: 10,
    format: '08X XXX XXXX',
    example: '+353 85 123 4567',
  },
  CA: {
    country: 'Canada',
    countryCode: '+1',
    pattern: /^(\+?1)?[2-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    format: '(XXX) XXX-XXXX',
    example: '+1 (416) 123-4567',
  },
  AU: {
    country: 'Australia',
    countryCode: '+61',
    pattern: /^(\+?61|0)?[2-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    format: '04XX XXX XXX',
    example: '+61 412 345 678',
  },
  NZ: {
    country: 'New Zealand',
    countryCode: '+64',
    pattern: /^(\+?64|0)?[2-9]\d{7,9}$/,
    minLength: 8,
    maxLength: 10,
    format: '02X XXX XXXX',
    example: '+64 21 123 4567',
  },
  JP: {
    country: 'Japan',
    countryCode: '+81',
    pattern: /^(\+?81|0)?[1-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    format: '0X0-XXXX-XXXX',
    example: '+81 90 1234 5678',
  },
  CN: {
    country: 'China',
    countryCode: '+86',
    pattern: /^(\+?86)?[1][3-9]\d{9}$/,
    minLength: 11,
    maxLength: 11,
    format: '1XX XXXX XXXX',
    example: '+86 138 0000 0000',
  },
  IN: {
    country: 'India',
    countryCode: '+91',
    pattern: /^(\+?91)?[6-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    format: '9XXXX XXXXX',
    example: '+91 98765 43210',
  },
  BR: {
    country: 'Brazil',
    countryCode: '+55',
    pattern: /^(\+?55)?[1-9]\d{10}$/,
    minLength: 11,
    maxLength: 11,
    format: '(XX) 9XXXX-XXXX',
    example: '+55 11 91234-5678',
  },
  MX: {
    country: 'Mexico',
    countryCode: '+52',
    pattern: /^(\+?52)?[1-9]\d{9,10}$/,
    minLength: 10,
    maxLength: 11,
    format: 'XX XXXX XXXX',
    example: '+52 55 1234 5678',
  },
  AR: {
    country: 'Argentina',
    countryCode: '+54',
    pattern: /^(\+?54)?[1-9]\d{9,10}$/,
    minLength: 10,
    maxLength: 11,
    format: '9 11 XXXX-XXXX',
    example: '+54 9 11 1234-5678',
  },
};

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formattedPhone?: string;
  countryCode?: string;
  nationalNumber?: string;
}

/**
 * Normalize phone number by removing all non-digit characters except '+'
 */
function normalizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Detect country from phone number
 */
export function detectCountryFromPhone(phone: string): CountryCode | null {
  const normalized = normalizePhoneNumber(phone);
  
  // Check each country's pattern
  for (const [code, rule] of Object.entries(PHONE_VALIDATION_RULES)) {
    if (rule.pattern.test(normalized)) {
      return code as CountryCode;
    }
  }
  
  return null;
}

/**
 * Validate phone number for a specific country
 */
export function validatePhoneNumber(
  phone: string,
  countryCode: CountryCode = 'RO'
): PhoneValidationResult {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Numărul de telefon este obligatoriu',
    };
  }

  const normalized = normalizePhoneNumber(phone);
  const rule = PHONE_VALIDATION_RULES[countryCode];

  if (!rule) {
    return {
      isValid: false,
      error: `Țara ${countryCode} nu este suportată`,
    };
  }

  // Special handling for Romania
  if (countryCode === 'RO') {
    // Remove spaces and other formatting
    const digitsOnly = normalized.replace(/\D/g, '');
    
    // Case 1: Starts with +40 (should have 9 digits after it: 7XXXXXXXX)
    if (normalized.startsWith('+40')) {
      const afterCode = normalized.replace('+40', '').replace(/\D/g, '');
      if (afterCode.length !== 9) {
        return {
          isValid: false,
          error: `Număr invalid. După +40 trebuie să existe exact 9 cifre (ex: +40 722 123 456). Ai introdus ${afterCode.length} cifre.`,
        };
      }
      if (!afterCode.startsWith('7') && !afterCode.startsWith('2')) {
        return {
          isValid: false,
          error: 'Numărul trebuie să înceapă cu 7 (mobil) sau 2 (fix)',
        };
      }
      return {
        isValid: true,
        formattedPhone: `+40${afterCode}`,
        countryCode: '+40',
        nationalNumber: afterCode,
      };
    }
    
    // Case 2: Starts with 40 without + (should have 9 digits after it: 7XXXXXXXX)
    if (normalized.startsWith('40') && !normalized.startsWith('400')) {
      const afterCode = normalized.replace(/^40/, '').replace(/\D/g, '');
      if (afterCode.length !== 9) {
        return {
          isValid: false,
          error: `Număr invalid. După 40 trebuie să existe exact 9 cifre (ex: 40 722 123 456). Ai introdus ${afterCode.length} cifre.`,
        };
      }
      if (!afterCode.startsWith('7') && !afterCode.startsWith('2')) {
        return {
          isValid: false,
          error: 'Numărul trebuie să înceapă cu 7 (mobil) sau 2 (fix)',
        };
      }
      return {
        isValid: true,
        formattedPhone: `+40${afterCode}`,
        countryCode: '+40',
        nationalNumber: afterCode,
      };
    }
    
    // Case 3: Starts with 0 (should have 10 digits total: 07XXXXXXXX)
    if (normalized.startsWith('0')) {
      if (digitsOnly.length !== 10) {
        return {
          isValid: false,
          error: `Număr invalid. Trebuie să conțină exact 10 cifre (ex: 0722 123 456). Ai introdus ${digitsOnly.length} cifre.`,
        };
      }
      const withoutZero = digitsOnly.substring(1);
      if (!withoutZero.startsWith('7') && !withoutZero.startsWith('2')) {
        return {
          isValid: false,
          error: 'Numărul trebuie să înceapă cu 07 (mobil) sau 02 (fix)',
        };
      }
      return {
        isValid: true,
        formattedPhone: `+40${withoutZero}`,
        countryCode: '+40',
        nationalNumber: withoutZero,
      };
    }
    
    // Case 4: Direct 9 digits starting with 7 or 2
    if (digitsOnly.length === 9 && (digitsOnly.startsWith('7') || digitsOnly.startsWith('2'))) {
      return {
        isValid: true,
        formattedPhone: `+40${digitsOnly}`,
        countryCode: '+40',
        nationalNumber: digitsOnly,
      };
    }
    
    // If none of the above, invalid format
    return {
      isValid: false,
      error: `Format invalid. Folosește: 0722123456 (10 cifre) sau +40 722123456 (9 cifre după +40)`,
    };
  }

  // For other countries, use the pattern matching
  if (!rule.pattern.test(normalized)) {
    return {
      isValid: false,
      error: `Număr de telefon invalid pentru ${rule.country}. Format așteptat: ${rule.format} (ex: ${rule.example})`,
    };
  }

  // Extract national number (without country code)
  let nationalNumber = normalized;
  if (normalized.startsWith('+')) {
    nationalNumber = normalized.replace(rule.countryCode, '');
  } else if (normalized.startsWith('0')) {
    nationalNumber = normalized.substring(1);
  }

  // Check length
  const digitCount = nationalNumber.replace(/\D/g, '').length;
  if (digitCount < rule.minLength || digitCount > rule.maxLength) {
    return {
      isValid: false,
      error: `Numărul trebuie să conțină între ${rule.minLength} și ${rule.maxLength} cifre`,
    };
  }

  // Format phone number
  const formattedPhone = normalized.startsWith('+')
    ? normalized
    : `${rule.countryCode}${nationalNumber}`;

  return {
    isValid: true,
    formattedPhone,
    countryCode: rule.countryCode,
    nationalNumber,
  };
}

/**
 * Auto-detect and validate phone number
 * Tries to detect country from phone format
 */
export function autoValidatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Numărul de telefon este obligatoriu',
    };
  }

  const normalized = normalizePhoneNumber(phone);
  
  // Try to detect country
  const detectedCountry = detectCountryFromPhone(normalized);
  
  if (detectedCountry) {
    return validatePhoneNumber(phone, detectedCountry);
  }

  // If no country detected, use default (Romania)
  return validatePhoneNumber(phone, 'RO');
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string, countryCode: CountryCode = 'RO'): string {
  const validation = validatePhoneNumber(phone, countryCode);
  return validation.formattedPhone || phone;
}

/**
 * Get phone validation rule for a country
 */
export function getPhoneRule(countryCode: CountryCode): PhoneValidationRule | null {
  return PHONE_VALIDATION_RULES[countryCode] || null;
}

/**
 * Get list of all supported countries
 */
export function getSupportedCountries(): Array<{ code: CountryCode; name: string; countryCode: string }> {
  return Object.entries(PHONE_VALIDATION_RULES).map(([code, rule]) => ({
    code: code as CountryCode,
    name: rule.country,
    countryCode: rule.countryCode,
  }));
}
