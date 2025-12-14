export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || 'ProWeb Studio',
  tagline: 'Digitale innovatie met kosmische impact',
  description:
    'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D‑websites die scoren in Google en converteren.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, ''),
  email: process.env.NEXT_PUBLIC_CONTACT_INBOX || process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
  phone: process.env.NEXT_PUBLIC_PHONE || process.env.PHONE || '', // Set via environment variable
  company: {
    kvk: process.env.NEXT_PUBLIC_KVK || '93769865',
    btw: process.env.NEXT_PUBLIC_BTW || 'NL005041113B60',
  },
  social: {
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://linkedin.com/company/proweb-studio',
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || 'https://github.com/proweb-studio',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://twitter.com/prowebstudio_nl',
  },
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Diensten', href: '/diensten' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Engineering', href: '/engineering' },
    { name: 'Over Ons', href: '/over-ons' },
    { name: 'Werkwijze', href: '/werkwijze' },
    { name: 'Contact', href: '/contact' },
  ],
  links: {
    calcom: process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/prowebstudio',
  },
  analytics: {
    plausibleDomain:
      process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'prowebstudio.nl',
  },
  contact: {
    inbox: process.env.NEXT_PUBLIC_CONTACT_INBOX || process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
  },
};

export type SiteConfig = typeof siteConfig;
