// Edge runtime for static XML generation (see docs/ADR-runtime.md)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

interface ImageEntry {
  loc: string; // Image URL
  caption?: string; // Image caption
  geoLocation?: string; // Geographic location of the image
  title?: string; // Image title
  license?: string; // License URL for the image
}

interface ImageSitemapEntry {
  url: string; // Page URL containing the image
  images: ImageEntry[];
  lastModified?: string;
}

export async function GET() {
  const baseUrl = SITE_URL;
  
  // Define all key images across the website with their metadata
  const imageSitemapEntries: ImageSitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString().split('T')[0],
      images: [
        {
          loc: `${baseUrl}/assets/hero/nebula_helix.avif`,
          caption: 'ProWeb Studio - Revolutionaire webontwikkeling met kosmische precisie in Nederland',
          title: 'Hero achtergrond - Nebula Helix - Website laten maken',
          geoLocation: 'Netherlands',
        },
        {
          loc: `${baseUrl}/assets/hero/nebula_helix.webp`,
          caption: 'ProWeb Studio - Revolutionaire webontwikkeling met kosmische precisie in Nederland',
          title: 'Hero achtergrond - Nebula Helix (WebP) - Webdesign Nederland',
          geoLocation: 'Netherlands',
        },
        {
          loc: `${baseUrl}/assets/hero_portal_background.avif`,
          caption: 'ProWeb Studio portaal - Toegang tot digitale transformatie voor Nederlandse bedrijven',
          title: 'Hero Portal achtergrond - Website ontwikkeling',
          geoLocation: 'Netherlands',
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: 'ProWeb Studio logo - Professionele webontwikkeling Amsterdam Rotterdam Utrecht',
          title: 'ProWeb Studio Logo Lockup - Webdesign Bureau Nederland',
          geoLocation: 'Netherlands',
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-icon.svg`,
          caption: 'ProWeb Studio icoon - Nederlandse webdesign specialist',
          title: 'ProWeb Studio Icoon - Website maken Nederland',
          geoLocation: 'Netherlands',
        },
      ],
    },
    {
      url: `${baseUrl}/diensten`,
      lastModified: '2025-09-20',
      images: [
        {
          loc: `${baseUrl}/assets/nebula_services_background.avif`,
          caption: 'Onze diensten - Webontwikkeling, design en digitale strategieën',
          title: 'Services achtergrond - Nebula',
        },
        {
          loc: `${baseUrl}/assets/nebula_services_background.webp`,
          caption: 'Onze diensten - Webontwikkeling, design en digitale strategieën',
          title: 'Services achtergrond - Nebula (WebP)',
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: 'ProWeb Studio - Professionele webdiensten',
          title: 'ProWeb Studio Logo',
        },
      ],
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2025-09-15',
      images: [
        {
          loc: `${baseUrl}/assets/glowing_beacon_contact.avif`,
          caption: 'Contact ProWeb Studio - Laat uw digitale visie werkelijkheid worden',
          title: 'Contact achtergrond - Glowing Beacon',
          geoLocation: 'Netherlands', // Contact page is location-relevant
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: 'ProWeb Studio contact - Neem contact op voor uw project',
          title: 'ProWeb Studio Logo',
        },
      ],
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: '2025-09-05',
      images: [
        {
          loc: `${baseUrl}/assets/team_core_star.webp`,
          caption: 'Over ProWeb Studio - Ons expertteam en visie',
          title: 'Team Core Star achtergrond',
        },
        {
          loc: `${baseUrl}/assets/team_core_star.png`,
          caption: 'Over ProWeb Studio - Ons expertteam en visie',
          title: 'Team Core Star achtergrond (PNG)',
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: 'ProWeb Studio team - Kennismaking met onze experts',
          title: 'ProWeb Studio Logo',
        },
      ],
    },
    {
      url: `${baseUrl}/werkwijze`,
      lastModified: '2025-09-10',
      images: [
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: 'ProWeb Studio werkwijze - Onze methodologie en proces',
          title: 'ProWeb Studio Logo',
        },
      ],
    },
    // Additional pages can be added here as the site grows
  ];

  // Generate the XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageSitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>${entry.lastModified ? `\n    <lastmod>${entry.lastModified}</lastmod>` : ''}
${entry.images
  .map(
    (image) => `    <image:image>
      <image:loc>${image.loc}</image:loc>${image.caption ? `\n      <image:caption><![CDATA[${image.caption}]]></image:caption>` : ''}${image.title ? `\n      <image:title><![CDATA[${image.title}]]></image:title>` : ''}${image.geoLocation ? `\n      <image:geo_location>${image.geoLocation}</image:geo_location>` : ''}${image.license ? `\n      <image:license>${image.license}</image:license>` : ''}
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}