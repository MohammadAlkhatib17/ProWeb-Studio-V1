/**
 * Dutch Formatting Utilities
 * 
 * Pure functions for formatting numbers, currency, and dates according to Dutch (nl-NL) locale.
 * All functions are testable and have no external dependencies.
 * 
 * @module lib/content/dutch-format
 */

/**
 * Format a number according to Dutch locale
 * 
 * @param value - The number to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234.56); // "1.234,56"
 * formatNumber(1000, { minimumFractionDigits: 0 }); // "1.000"
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('nl-NL', options).format(value);
}

/**
 * Format a currency amount in EUR according to Dutch locale
 * 
 * @param value - The amount to format
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56); // "€ 1.234,56"
 * formatCurrency(1500, false); // "€ 1.500"
 * formatCurrency(99.50); // "€ 99,50"
 */
export function formatCurrency(value: number, showDecimals: boolean = true): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  };
  
  return new Intl.NumberFormat('nl-NL', options).format(value);
}

/**
 * Format a price range in EUR
 * 
 * @param min - Minimum price
 * @param max - Maximum price
 * @param showDecimals - Whether to show decimal places
 * @returns Formatted price range string
 * 
 * @example
 * formatPriceRange(1500, 5000); // "€ 1.500 - € 5.000"
 * formatPriceRange(99.50, 199.90); // "€ 99,50 - € 199,90"
 */
export function formatPriceRange(
  min: number,
  max: number,
  showDecimals: boolean = false
): string {
  return `${formatCurrency(min, showDecimals)} - ${formatCurrency(max, showDecimals)}`;
}

/**
 * Format a date according to Dutch locale
 * 
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date('2024-10-19')); // "19 oktober 2024"
 * formatDate(new Date(), { dateStyle: 'short' }); // "19-10-2024"
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('nl-NL', options || defaultOptions).format(date);
}

/**
 * Format a percentage according to Dutch locale
 * 
 * @param value - The decimal value (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(0.15); // "15%"
 * formatPercentage(0.075, 1); // "7,5%"
 * formatPercentage(0.9875, 2); // "98,75%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a large number with Dutch abbreviations (K, M)
 * 
 * @param value - The number to format
 * @returns Abbreviated number string
 * 
 * @example
 * formatLargeNumber(1234); // "1,2K"
 * formatLargeNumber(1500000); // "1,5M"
 * formatLargeNumber(850); // "850"
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${formatNumber(value / 1000000, { maximumFractionDigits: 1 })}M`;
  }
  if (value >= 1000) {
    return `${formatNumber(value / 1000, { maximumFractionDigits: 1 })}K`;
  }
  return formatNumber(value, { maximumFractionDigits: 0 });
}

/**
 * Format a phone number in Dutch format
 * 
 * @param number - The phone number (digits only or with prefix)
 * @returns Formatted phone number
 * 
 * @example
 * formatPhoneNumber('0201234567'); // "020-123 4567"
 * formatPhoneNumber('0612345678'); // "06-1234 5678"
 */
export function formatPhoneNumber(number: string): string {
  // Remove all non-digits
  const digits = number.replace(/\D/g, '');
  
  // Format based on number type
  if (digits.startsWith('06')) {
    // Mobile: 06-1234 5678
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)} ${digits.slice(6)}`;
  } else if (digits.startsWith('0')) {
    // Landline: 0XX-XXX XXXX
    const areaCodeLength = digits.startsWith('020') || digits.startsWith('070') ? 3 : 3;
    return `${digits.slice(0, areaCodeLength)}-${digits.slice(areaCodeLength, areaCodeLength + 3)} ${digits.slice(areaCodeLength + 3)}`;
  }
  
  return number;
}

/**
 * Format a postal code in Dutch format
 * 
 * @param code - The postal code (with or without space)
 * @returns Formatted postal code
 * 
 * @example
 * formatPostalCode('1011AA'); // "1011 AA"
 * formatPostalCode('1011aa'); // "1011 AA"
 */
export function formatPostalCode(code: string): string {
  const cleaned = code.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return code;
}

/**
 * Format a duration in Dutch
 * 
 * @param weeks - Number of weeks
 * @returns Dutch duration string
 * 
 * @example
 * formatDuration(1); // "1 week"
 * formatDuration(4); // "4 weken"
 * formatDuration(0.5); // "3-5 dagen"
 */
export function formatDuration(weeks: number): string {
  if (weeks < 1) {
    const days = Math.round(weeks * 7);
    return `${days} ${days === 1 ? 'dag' : 'dagen'}`;
  }
  
  if (weeks === 1) {
    return '1 week';
  }
  
  return `${weeks} weken`;
}

/**
 * Format a distance in kilometers
 * 
 * @param km - Distance in kilometers
 * @returns Formatted distance string
 * 
 * @example
 * formatDistance(1.5); // "1,5 km"
 * formatDistance(25); // "25 km"
 */
export function formatDistance(km: number): string {
  return `${formatNumber(km, { maximumFractionDigits: 1 })} km`;
}
