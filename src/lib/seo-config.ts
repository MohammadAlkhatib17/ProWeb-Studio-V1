export const dutchProvinces = [
  'Noord-Holland',
  'Zuid-Holland', 
  'Utrecht',
  'Noord-Brabant',
  'Gelderland',
  'Limburg',
  'Overijssel',
  'Flevoland',
  'Groningen',
  'Zeeland',
  'Friesland',
  'Drenthe',
];

export const seoConfig = {
  defaultTitle: 'Website Laten Maken | ProWeb Studio Amsterdam',
  titleTemplate: '%s | ProWeb Studio',
  defaultDescription: 'Website laten maken door professionals in Amsterdam. ✓ Maatwerk websites ✓ Scherpe prijzen ✓ Snelle oplevering. Vraag nu een gratis offerte aan!', // 159 chars
  siteUrl: 'https://prowebstudio.nl',
  locale: 'nl_NL',
  type: 'website',
  siteName: 'ProWeb Studio',
  twitterHandle: '@prowebstudio',
  
  // Page-specific meta configurations
  pages: {
    home: {
      title: 'Website Laten Maken | ProWeb Studio Amsterdam', // 48 chars
      description: 'Website laten maken door professionals in Amsterdam. ✓ Maatwerk websites ✓ Scherpe prijzen ✓ Snelle oplevering. Vraag nu een gratis offerte aan!', // 159 chars
      keywords: 'website laten maken, webdesign amsterdam, website ontwikkeling, professionele website, maatwerk website',
    },
    services: {
      title: 'Diensten - Website Laten Maken & Webdesign', // 44 chars
      description: 'Complete webdevelopment diensten: website laten maken, webshops, web applicaties & SEO. Professionele oplossingen voor heel Nederland. Bel nu!', // 157 chars
      keywords: 'website laten maken diensten, webdesign services, website ontwikkeling nederland, webshop laten maken',
    },
    portfolio: {
      title: 'Portfolio - Websites Die Wij Gemaakt Hebben', // 45 chars
      description: 'Bekijk ons portfolio met professionele websites die wij gemaakt hebben voor klanten in heel Nederland. Laat u inspireren door onze projecten!', // 156 chars
      keywords: 'portfolio websites, website voorbeelden, webdesign portfolio, gemaakte websites',
    },
    about: {
      title: 'Over Ons - Expert Website Developers Nederland', // 48 chars
      description: 'ProWeb Studio: ervaren team voor website laten maken in Nederland. 10+ jaar expertise in webdesign & development. Ontdek waarom klanten ons kiezen!', // 158 chars
      keywords: 'over prowebstudio, website bureau nederland, webdesign team, website specialisten',
    },
    contact: {
      title: 'Contact - Website Laten Maken? Vraag Offerte', // 46 chars  
      description: 'Neem contact op voor website laten maken. Gratis adviesgesprek & offerte binnen 24 uur. Bel 020-123-4567 of vul het contactformulier in. Start nu!', // 157 chars
      keywords: 'contact website laten maken, offerte website, website prijzen, gratis advies',
    },
    blog: {
      title: 'Blog - Tips Website Laten Maken & Webdesign', // 45 chars
      description: 'Lees onze blog voor tips over website laten maken, webdesign trends, SEO & online marketing. Praktische inzichten van Nederlandse web professionals.', // 158 chars
      keywords: 'webdesign blog, website tips, online marketing blog, seo tips nederland',
    },
  },
  
  // Geo-targeting configuration
  geoTargeting: {
    country: 'NL',
    language: 'nl',
    region: 'NL',
    placename: 'Amsterdam',
    position: '52.3702;4.8952',
    ICBM: '52.3702, 4.8952',
  },
};

export function generateMetaTags(page: keyof typeof seoConfig.pages) {
  const pageConfig = seoConfig.pages[page];
  const { geoTargeting } = seoConfig;
  
  return {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: pageConfig.keywords,
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      type: 'website',
      locale: seoConfig.locale,
      url: `${seoConfig.siteUrl}/${page === 'home' ? '' : page}`,
      siteName: seoConfig.siteName,
      images: [{
        url: `${seoConfig.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: pageConfig.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageConfig.title,
      description: pageConfig.description,
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      images: [`${seoConfig.siteUrl}/twitter-image.jpg`],
    },
    geo: {
      region: geoTargeting.region,
      placename: geoTargeting.placename,
      position: geoTargeting.position,
      ICBM: geoTargeting.ICBM,
    },
    alternates: {
      canonical: `${seoConfig.siteUrl}/${page === 'home' ? '' : page}`,
      languages: {
        'nl': `${seoConfig.siteUrl}/${page === 'home' ? '' : page}`,
        'en': `${seoConfig.siteUrl}/en/${page === 'home' ? '' : page}`,
      },
    },
  };
}

// Generate province-specific meta tags
export function generateProvinceMetaTags(province: string) {
  return {
    title: `Website Laten Maken ${province} | ProWeb Studio`, // Under 60 chars
    description: `Website laten maken in ${province}? ProWeb Studio levert professionele websites voor bedrijven in heel ${province}. Gratis offerte binnen 24 uur!`, // 156 chars
    keywords: `website laten maken ${province}, webdesign ${province}, website bureau ${province}`,
  };
}
