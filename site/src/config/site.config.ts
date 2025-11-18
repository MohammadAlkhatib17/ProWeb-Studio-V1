export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || 'ProWeb Studio',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'ProWeb Studio',
  tagline: 'Digitale innovatie met kosmische impact',
  description:
    'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D‑websites die scoren in Google en converteren.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, ''),
  email: process.env.NEXT_PUBLIC_CONTACT_INBOX || process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
  phone: process.env.NEXT_PUBLIC_PHONE || process.env.PHONE || '+31207001234',
  
  // Business registration identifiers
  business: {
    kvk: process.env.NEXT_PUBLIC_KVK || '',
    btw: process.env.NEXT_PUBLIC_BTW || '',
    rsin: process.env.NEXT_PUBLIC_RSIN || '',
    kvkPlace: process.env.NEXT_PUBLIC_KVK_PLACE || '',
    vestigingsnummer: process.env.NEXT_PUBLIC_VESTIGINGSNUMMER || '',
    sbiCode: process.env.NEXT_PUBLIC_SBI_CODE || '62010',
    iban: process.env.NEXT_PUBLIC_IBAN || '',
  },
  
  // Business address
  address: {
    street: process.env.NEXT_PUBLIC_ADDR_STREET || '',
    city: process.env.NEXT_PUBLIC_ADDR_CITY || 'Amsterdam',
    postalCode: process.env.NEXT_PUBLIC_ADDR_ZIP || '',
    region: process.env.NEXT_PUBLIC_ADDR_REGION || 'Noord-Holland',
    country: 'Nederland',
    countryCode: 'NL',
  },
  
  // Opening hours
  openingHours: [
    { days: 'Maandag - Vrijdag', hours: '09:00 - 17:00' },
    { days: 'Weekend', hours: 'Op afspraak' },
  ],
  
  social: {
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://linkedin.com/company/proweb-studio',
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || 'https://github.com/proweb-studio',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://twitter.com/prowebstudio_nl',
    behance: process.env.NEXT_PUBLIC_SOCIAL_BEHANCE || '',
    dribbble: process.env.NEXT_PUBLIC_SOCIAL_DRIBBBLE || '',
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '',
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
  },
  
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Diensten', href: '/diensten' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Over Ons', href: '/over-ons' },
    { name: 'Speeltuin', href: '/speeltuin' },
    { name: 'Werkwijze', href: '/werkwijze' },
    { name: 'Contact', href: '/contact' },
  ],
  
  links: {
    calcom: process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/prowebstudio',
    googleBusiness: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || '',
  },
  
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'prowebstudio.nl',
    googlePlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '',
    duns: process.env.NEXT_PUBLIC_DUNS || '',
  },
  
  contact: {
    inbox: process.env.NEXT_PUBLIC_CONTACT_INBOX || process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
  },
};

export type SiteConfig = typeof siteConfig;
