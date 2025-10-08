import { describe, it, expect } from 'vitest';
import { GET as getSitemapIndex } from '@/app/sitemap-index.xml/route';
import { GET as getMainSitemap } from '@/app/sitemap';
import { GET as getImagesSitemap } from '@/app/sitemap-images.xml/route';
import { GET as getNewsSitemap } from '@/app/sitemap-news.xml/route';
import { GET as getVideosSitemap } from '@/app/sitemap-videos.xml/route';
import { 
  getLastModifiedDate, 
  getLatestModificationDate,
  generateSitemapXML,
  generateImageSitemapXML,
  generateSitemapIndexXML,
  chunkSitemapEntries,
  type SitemapUrl,
  type ImageSitemapEntry
} from '@/lib/sitemap-advanced';

describe('Advanced Sitemap System', () => {
  describe('Sitemap Index', () => {
    it('should generate valid sitemap index XML', async () => {
      const response = await getSitemapIndex();
      const xml = await response.text();
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('sitemap.xml');
      expect(xml).toContain('sitemap-images.xml');
      expect(xml).toContain('sitemap-news.xml');
      expect(xml).toContain('sitemap-videos.xml');
    });

    it('should include all required sitemaps', async () => {
      const response = await getSitemapIndex();
      const xml = await response.text();
      
      const expectedSitemaps = [
        'sitemap.xml',
        'sitemap-services.xml',
        'sitemap-locations.xml',
        'sitemap-images.xml',
        'sitemap-news.xml',
        'sitemap-videos.xml'
      ];

      expectedSitemaps.forEach(sitemap => {
        expect(xml).toContain(sitemap);
      });
    });
  });

  describe('Main Sitemap', () => {
    it('should generate valid main sitemap XML', async () => {
      const response = await getMainSitemap();
      const xml = await response.text();
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    });

    it('should include hreflang attributes', async () => {
      const response = await getMainSitemap();
      const xml = await response.text();
      
      expect(xml).toContain('hreflang="nl-NL"');
      expect(xml).toContain('hreflang="nl"');
    });

    it('should include required pages', async () => {
      const response = await getMainSitemap();
      const xml = await response.text();
      
      const requiredPages = [
        'prowebstudio.nl/',
        'prowebstudio.nl/contact',
        'prowebstudio.nl/portfolio',
        'prowebstudio.nl/werkwijze',
        'prowebstudio.nl/over-ons'
      ];

      requiredPages.forEach(page => {
        expect(xml).toContain(page);
      });
    });
  });

  describe('Image Sitemap', () => {
    it('should generate valid image sitemap XML', async () => {
      const response = await getImagesSitemap();
      const xml = await response.text();
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    });

    it('should include image metadata', async () => {
      const response = await getImagesSitemap();
      const xml = await response.text();
      
      expect(xml).toContain('<image:image>');
      expect(xml).toContain('<image:loc>');
      expect(xml).toContain('<image:caption>');
      expect(xml).toContain('<image:title>');
    });
  });

  describe('News Sitemap', () => {
    it('should generate valid news sitemap XML', async () => {
      const response = await getNewsSitemap();
      const xml = await response.text();
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
    });

    it('should include news metadata', async () => {
      const response = await getNewsSitemap();
      const xml = await response.text();
      
      expect(xml).toContain('<news:news>');
      expect(xml).toContain('<news:publication>');
      expect(xml).toContain('<news:publication_date>');
      expect(xml).toContain('<news:title>');
    });
  });

  describe('Video Sitemap', () => {
    it('should generate valid video sitemap XML', async () => {
      const response = await getVideosSitemap();
      const xml = await response.text();
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
    });

    it('should handle empty video content gracefully', async () => {
      const response = await getVideosSitemap();
      const xml = await response.text();
      
      // Should either contain video entries or be empty with comment
      expect(xml).toMatch(/<video:video>|<!-- No videos found -->/);
    });
  });

  describe('Utility Functions', () => {
    describe('getLastModifiedDate', () => {
      it('should return a valid date for existing files', () => {
        const date = getLastModifiedDate('package.json');
        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).toBeGreaterThan(0);
      });

      it('should return current date for non-existent files', () => {
        const date = getLastModifiedDate('non-existent-file.txt');
        expect(date).toBeInstanceOf(Date);
        // Should be recent (within last minute)
        expect(Date.now() - date.getTime()).toBeLessThan(60000);
      });
    });

    describe('getLatestModificationDate', () => {
      it('should return the latest date from multiple files', () => {
        const files = ['package.json', 'tsconfig.json'];
        const date = getLatestModificationDate(files);
        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).toBeGreaterThan(0);
      });

      it('should handle empty file array', () => {
        const date = getLatestModificationDate([]);
        expect(date).toBeInstanceOf(Date);
      });
    });

    describe('chunkSitemapEntries', () => {
      it('should split entries into chunks of specified size', () => {
        const entries = Array.from({ length: 150000 }, (_, i) => ({
          url: `https://example.com/page-${i}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }));

        const chunks = chunkSitemapEntries(entries, 50000);
        
        expect(chunks).toHaveLength(3);
        expect(chunks[0]).toHaveLength(50000);
        expect(chunks[1]).toHaveLength(50000);
        expect(chunks[2]).toHaveLength(50000);
      });

      it('should handle entries less than chunk size', () => {
        const entries: SitemapUrl[] = [
          {
            url: 'https://example.com/page-1',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          },
        ];

        const chunks = chunkSitemapEntries(entries, 50000);
        
        expect(chunks).toHaveLength(1);
        expect(chunks[0]).toHaveLength(1);
      });
    });

    describe('generateSitemapXML', () => {
      it('should generate valid XML for sitemap entries', () => {
        const entries: SitemapUrl[] = [
          {
            url: 'https://prowebstudio.nl/',
            lastModified: new Date('2025-01-15'),
            changeFrequency: 'daily',
            priority: 1.0,
            alternates: [
              { hreflang: 'nl-NL', href: 'https://prowebstudio.nl/' },
              { hreflang: 'nl', href: 'https://prowebstudio.nl/' },
            ],
          },
        ];

        const xml = generateSitemapXML(entries, true);
        
        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
        expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
        expect(xml).toContain('<loc>https://prowebstudio.nl/</loc>');
        expect(xml).toContain('<lastmod>2025-01-15</lastmod>');
        expect(xml).toContain('<changefreq>daily</changefreq>');
        expect(xml).toContain('<priority>1.0</priority>');
        expect(xml).toContain('hreflang="nl-NL"');
      });
    });

    describe('generateImageSitemapXML', () => {
      it('should generate valid XML for image entries', () => {
        const entries: ImageSitemapEntry[] = [
          {
            url: 'https://prowebstudio.nl/',
            images: [
              {
                loc: 'https://prowebstudio.nl/image.jpg',
                caption: 'Test image',
                title: 'Test Image Title',
                geoLocation: 'Netherlands',
              },
            ],
            lastModified: new Date('2025-01-15'),
          },
        ];

        const xml = generateImageSitemapXML(entries);
        
        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
        expect(xml).toContain('<image:image>');
        expect(xml).toContain('<image:loc>https://prowebstudio.nl/image.jpg</image:loc>');
        expect(xml).toContain('<image:caption><![CDATA[Test image]]></image:caption>');
        expect(xml).toContain('<image:geo_location>Netherlands</image:geo_location>');
      });
    });

    describe('generateSitemapIndexXML', () => {
      it('should generate valid sitemap index XML', () => {
        const sitemaps = [
          { loc: 'https://prowebstudio.nl/sitemap.xml', lastmod: new Date('2025-01-15') },
          { loc: 'https://prowebstudio.nl/sitemap-images.xml', lastmod: new Date('2025-01-14') },
        ];

        const xml = generateSitemapIndexXML(sitemaps);
        
        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
        expect(xml).toContain('<sitemap>');
        expect(xml).toContain('<loc>https://prowebstudio.nl/sitemap.xml</loc>');
        expect(xml).toContain('<lastmod>2025-01-15</lastmod>');
      });
    });
  });

  describe('URL Validation', () => {
    it('should ensure all URLs use HTTPS', async () => {
      const response = await getMainSitemap();
      const xml = await response.text();
      
      // Check that no HTTP URLs exist
      expect(xml).not.toMatch(/http:\/\/(?!www\.sitemaps\.org)/);
      
      // Check that HTTPS URLs exist
      expect(xml).toContain('https://prowebstudio.nl');
    });

    it('should use proper URL encoding', async () => {
      const response = await getMainSitemap();
      const xml = await response.text();
      
      // URLs should be properly formatted
      expect(xml).not.toContain(' '); // No spaces in URLs
      expect(xml).toMatch(/https:\/\/[^\s]+/); // Valid URL format
    });
  });

  describe('Cache Headers', () => {
    it('should set appropriate cache headers for main sitemap', async () => {
      const response = await getMainSitemap();
      
      expect(response.headers.get('cache-control')).toContain('public');
      expect(response.headers.get('cache-control')).toContain('max-age');
    });

    it('should set appropriate cache headers for image sitemap', async () => {
      const response = await getImagesSitemap();
      
      expect(response.headers.get('cache-control')).toContain('public');
      expect(response.headers.get('cache-control')).toContain('max-age');
    });
  });

  describe('Performance', () => {
    it('should generate sitemaps within reasonable time limits', async () => {
      const start = Date.now();
      await getSitemapIndex();
      const duration = Date.now() - start;
      
      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        url: `https://example.com/page-${i}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));

      const start = Date.now();
      const xml = generateSitemapXML(largeDataset);
      const duration = Date.now() - start;
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});