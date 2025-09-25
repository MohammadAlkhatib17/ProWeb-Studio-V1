import type { MetadataRoute } from 'next';
import { getSiteUrl, isPreview } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  
  if (isPreview()) {
    // For preview deployments: disallow all and no sitemaps
    return {
      rules: [
        {
          userAgent: '*',
          disallow: ['/'],
        }
      ],
      // No sitemap for preview deployments
    };
  }

  // Production robots.txt: allow all, advertise only required sitemaps
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [],
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/sitemap-images.xml`,
    ],
    host: 'prowebstudio.nl',
  };
}
