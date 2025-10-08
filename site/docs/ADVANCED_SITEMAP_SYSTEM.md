# Advanced Sitemap System

This document describes the comprehensive sitemap system implemented for ProWeb Studio, featuring dynamic generation, git-based modification dates, and support for multiple sitemap types.

## Overview

The sitemap system consists of multiple specialized sitemaps that provide search engines with detailed information about the website's content:

- **Main Sitemap** (`/sitemap.xml`) - Core pages with hreflang support
- **Image Sitemap** (`/sitemap-images.xml`) - Visual content for image search
- **News Sitemap** (`/sitemap-news.xml`) - Blog posts and updates
- **Video Sitemap** (`/sitemap-videos.xml`) - Video content for video search
- **Service Sitemap** (`/sitemap-services.xml`) - Service-specific pages
- **Location Sitemap** (`/sitemap-locations.xml`) - Location-based pages
- **Sitemap Index** (`/sitemap-index.xml`) - Central index of all sitemaps

## Features

### 🔄 Dynamic Generation
- Git-based modification dates using `git log` command
- File system fallback for modification times
- Automatic image and video scanning
- Real-time content discovery

### 🌐 International SEO
- Hreflang attributes for Dutch market (`nl-NL`, `nl`)
- Proper URL canonicalization
- Multi-language support ready

### 📊 Standards Compliance
- XML namespace declarations for each sitemap type
- 50,000 URL limit per sitemap with automatic chunking
- Proper CDATA escaping for text content
- Valid XML structure with comprehensive validation

### ⚡ Performance Optimized
- Edge runtime for global distribution
- Intelligent caching headers
- Efficient XML generation
- Minimal processing overhead

### 🔍 Search Engine Features
- Image metadata (captions, titles, geo-location)
- Video metadata (thumbnails, duration, publication dates)
- News metadata (publication dates, keywords)
- Priority and change frequency optimization

## File Structure

```
src/
├── app/
│   ├── sitemap.ts                    # Main sitemap
│   ├── sitemap-index.xml/route.ts    # Sitemap index
│   ├── sitemap-images.xml/route.ts   # Image sitemap
│   ├── sitemap-news.xml/route.ts     # News sitemap
│   ├── sitemap-videos.xml/route.ts   # Video sitemap
│   ├── sitemap-services.xml/route.ts # Service sitemap
│   └── sitemap-locations.xml/route.ts# Location sitemap
├── lib/
│   ├── sitemap-advanced.ts           # Advanced utilities
│   └── sitemap-utils.ts              # Legacy utilities
├── __tests__/
│   └── sitemap.test.ts               # Comprehensive tests
└── scripts/
    └── validate-sitemaps.sh          # Validation script
```

## Configuration

### Environment Variables
```bash
# Required
SITE_URL=https://prowebstudio.nl
NEXT_PUBLIC_SITE_URL=https://prowebstudio.nl

# Optional
NODE_ENV=production
```

### Vercel Configuration
The sitemaps are configured for optimal performance on Vercel:
```typescript
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = ['cdg1', 'lhr1', 'fra1']; // EU regions
```

## Usage

### Accessing Sitemaps
All sitemaps are accessible via standard URLs:
- https://prowebstudio.nl/sitemap-index.xml (main entry point)
- https://prowebstudio.nl/sitemap.xml
- https://prowebstudio.nl/sitemap-images.xml
- https://prowebstudio.nl/sitemap-news.xml
- https://prowebstudio.nl/sitemap-videos.xml

### robots.txt Integration
The `robots.txt` file automatically references all sitemaps:
```
Sitemap: https://prowebstudio.nl/sitemap-index.xml
Sitemap: https://prowebstudio.nl/sitemap.xml
Sitemap: https://prowebstudio.nl/sitemap-services.xml
Sitemap: https://prowebstudio.nl/sitemap-locations.xml
Sitemap: https://prowebstudio.nl/sitemap-images.xml
Sitemap: https://prowebstudio.nl/sitemap-news.xml
Sitemap: https://prowebstudio.nl/sitemap-videos.xml
```

## Advanced Features

### Git-Based Modification Dates
The system automatically determines the last modification date for pages using:
1. Git commit history (`git log -1 --format="%ci" -- filename`)
2. File system modification time (fallback)
3. Current date (final fallback)

```typescript
export function getLastModifiedDate(filePath: string): Date {
  try {
    const gitDate = execSync(
      `git log -1 --format="%ci" -- "${filePath}"`,
      { encoding: 'utf-8', cwd: process.cwd() }
    ).trim();
    
    if (gitDate) {
      return new Date(gitDate);
    }
  } catch (error) {
    // Fallback to file system
  }
  
  return statSync(filePath).mtime;
}
```

### Automatic Content Discovery
Images and videos are automatically discovered by scanning the public directory:

```typescript
// Automatic image discovery
const imageEntries = scanImagesInDirectory('/public', baseUrl);

// Automatic video discovery  
const videoEntries = scanVideosInDirectory('/public', baseUrl);
```

### URL Chunking for Scale
The system automatically splits large sitemaps to respect the 50,000 URL limit:

```typescript
export function chunkSitemapEntries<T>(
  entries: T[], 
  maxPerSitemap: number = 50000
): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < entries.length; i += maxPerSitemap) {
    chunks.push(entries.slice(i, i + maxPerSitemap));
  }
  
  return chunks;
}
```

## Validation & Testing

### Automated Validation
Run the comprehensive validation script:
```bash
./scripts/validate-sitemaps.sh [BASE_URL]
```

The script validates:
- XML structure and syntax
- Namespace declarations
- URL format compliance
- Performance metrics
- 50k URL limit compliance
- Hreflang implementation

### Unit Tests
Run the test suite:
```bash
npm test sitemap.test.ts
```

Tests cover:
- XML generation
- URL validation
- Performance benchmarks
- Edge cases
- Cache headers
- Content discovery

### Manual Testing
Check sitemap accessibility:
```bash
curl -I https://prowebstudio.nl/sitemap-index.xml
curl -I https://prowebstudio.nl/sitemap.xml
curl -I https://prowebstudio.nl/sitemap-images.xml
```

## Performance Considerations

### Caching Strategy
- **Main Sitemap**: 1 hour cache (`max-age=3600`)
- **Image Sitemap**: 24 hour cache (`max-age=86400`)
- **News Sitemap**: 1 hour cache (`max-age=3600`)
- **Video Sitemap**: 24 hour cache (`max-age=86400`)

### Edge Runtime Benefits
- Global distribution via Vercel Edge Network
- Reduced cold start times
- Better performance for international users
- Automatic scaling

### Memory Optimization
- Streaming XML generation for large datasets
- Minimal in-memory footprint
- Efficient string building
- Garbage collection friendly

## SEO Benefits

### Search Engine Discovery
- Faster indexing of new content
- Better understanding of site structure
- Enhanced rich snippets in search results
- Improved crawl efficiency

### Image SEO
- Detailed image metadata
- Geographic tagging for local SEO
- Caption and title optimization
- License information support

### Video SEO
- Video rich snippets
- Thumbnail optimization
- Duration and publication date metadata
- Family-friendly content marking

### News SEO
- Rapid news indexing
- Keyword optimization
- Publication metadata
- Google News compatibility

## Monitoring & Maintenance

### Regular Checks
1. **Weekly**: Run validation script
2. **Monthly**: Review URL counts and performance
3. **Quarterly**: Audit content discovery accuracy
4. **Annually**: Review SEO performance impact

### Common Issues
- **Git command failures**: Ensure git is available in production
- **File permission errors**: Check read access to source files
- **XML parsing errors**: Validate CDATA escaping
- **URL encoding issues**: Verify proper URL formatting

### Performance Monitoring
```bash
# Check sitemap response times
time curl -s https://prowebstudio.nl/sitemap-index.xml > /dev/null

# Monitor sitemap sizes
curl -s https://prowebstudio.nl/sitemap.xml | wc -c
```

## Future Enhancements

### Planned Features
- [ ] Database-driven content integration
- [ ] Multi-language sitemap support
- [ ] Advanced video metadata extraction
- [ ] Real-time sitemap updates via webhooks
- [ ] Sitemap analytics and reporting

### CMS Integration Ready
The system is designed to easily integrate with headless CMS:
```typescript
// Example CMS integration
export async function fetchBlogPosts(): Promise<NewsSitemapEntry[]> {
  const posts = await cms.posts.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' }
  });
  
  return posts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    news: {
      publicationDate: post.publishedAt,
      title: post.title,
      keywords: post.tags.join(', ')
    },
    lastModified: post.updatedAt
  }));
}
```

## Support

For issues or questions about the sitemap system:
1. Check the validation script output
2. Review the test suite results
3. Consult the performance monitoring data
4. Check search engine webmaster tools

## Standards Compliance

This implementation follows:
- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Image Sitemap Extension](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Video Sitemap Extension](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps)
- [News Sitemap Extension](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemaps)
- [Hreflang Implementation](https://developers.google.com/search/docs/specialty/international/localized-versions)