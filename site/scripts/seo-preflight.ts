#!/usr/bin/env ts-node
/**
 * SEO/Performance Preflight Check Script
 * 
 * This script performs automated checks on the built Next.js application to ensure:
 * - Structured data uniqueness and completeness
 * - Sitemap hygiene  
 * - Internal link integrity
 * - Robots meta compliance
 * 
 * Usage: npm run seo:preflight (after npm run build)
 */

import { spawn } from 'child_process';
import { request } from 'undici';
import * as cheerio from 'cheerio';

// Configuration
const SERVER_PORT = 4010;
const BASE_URL = `http://localhost:${SERVER_PORT}`;
const STARTUP_TIMEOUT = 30000; // 30 seconds
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Test routes
const ROUTES = [
  '/',
  '/diensten',
  '/werkwijze', 
  '/over-ons',
  '/contact',
  '/privacy',
  '/voorwaarden'
];

interface CheckResult {
  route: string;
  check: string;
  status: 'pass' | 'fail';
  message?: string;
}

interface ServerProcess {
  process: ReturnType<typeof spawn>;
  cleanup: () => void;
}

class SEOPreflightChecker {
  private results: CheckResult[] = [];
  private serverProcess: ServerProcess | null = null;

  /**
   * Start Next.js server on specified port
   */
  private async startServer(): Promise<ServerProcess> {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting Next.js server on port ${SERVER_PORT}...`);
      
      const nextProcess = spawn('npx', ['next', 'start', '-p', SERVER_PORT.toString()], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production' }
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          nextProcess.kill();
          reject(new Error(`Server failed to start within ${STARTUP_TIMEOUT}ms`));
        }
      }, STARTUP_TIMEOUT);

      const cleanup = () => {
        clearTimeout(timeout);
        if (nextProcess && !nextProcess.killed) {
          nextProcess.kill('SIGTERM');
          setTimeout(() => {
            if (!nextProcess.killed) {
              nextProcess.kill('SIGKILL');
            }
          }, 5000);
        }
      };

      nextProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`📊 Server: ${output.trim()}`);
        
        if (output.includes('Ready on') || output.includes(`http://localhost:${SERVER_PORT}`)) {
          serverReady = true;
          clearTimeout(timeout);
          resolve({ process: nextProcess, cleanup });
        }
      });

      nextProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error(`❌ Server Error: ${error.trim()}`);
      });

      nextProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to start server: ${error.message}`));
      });

      nextProcess.on('exit', (code) => {
        clearTimeout(timeout);
        if (!serverReady && code !== 0) {
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Wait for server to be ready by checking health
   */
  private async waitForServer(): Promise<void> {
    const maxAttempts = 30;
    const attemptInterval = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await request(`${BASE_URL}/`, { 
          method: 'HEAD',
          headersTimeout: REQUEST_TIMEOUT,
          bodyTimeout: REQUEST_TIMEOUT
        });
        console.log(`✅ Server is ready after ${attempt} attempts`);
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`Server not ready after ${maxAttempts} attempts`);
        }
        console.log(`⏳ Waiting for server... (attempt ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, attemptInterval));
      }
    }
  }

  /**
   * Fetch page content
   */
  private async fetchPage(route: string): Promise<{ html: string; status: number }> {
    try {
      const response = await request(`${BASE_URL}${route}`, {
        headersTimeout: REQUEST_TIMEOUT,
        bodyTimeout: REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'SEO-Preflight-Checker/1.0'
        }
      });
      
      const html = await response.body.text();
      return { html, status: response.statusCode };
    } catch (error) {
      throw new Error(`Failed to fetch ${route}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse and validate JSON-LD structured data
   */
  private parseJsonLd(html: string): any[] {
    const $ = cheerio.load(html);
    const jsonLdScripts = $('script[type="application/ld+json"]');
    const parsedData: any[] = [];

    jsonLdScripts.each((_, script) => {
      try {
        const content = $(script).html();
        if (content) {
          const parsed = JSON.parse(content);
          
          // Handle both single objects and arrays
          if (Array.isArray(parsed)) {
            parsedData.push(...parsed);
          } else {
            parsedData.push(parsed);
          }
        }
      } catch (error) {
        console.warn(`⚠️  Failed to parse JSON-LD: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return parsedData;
  }

  /**
   * Check structured data requirements for a specific route
   */
  private checkStructuredData(route: string, html: string): void {
    const jsonLdData = this.parseJsonLd(html);
    
    // Count occurrences of each schema type
    const typeCounts = jsonLdData.reduce((acc, item) => {
      const type = item['@type'];
      if (type) {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Check for exactly one BreadcrumbList per page
    const breadcrumbCount = typeCounts['BreadcrumbList'] || 0;
    if (breadcrumbCount !== 1) {
      this.results.push({
        route,
        check: 'BreadcrumbList uniqueness',
        status: 'fail',
        message: `Expected exactly 1 BreadcrumbList, found ${breadcrumbCount}`
      });
    } else {
      this.results.push({
        route,
        check: 'BreadcrumbList uniqueness',
        status: 'pass'
      });
    }

    // Check for exactly one WebPage per page
    const webPageCount = typeCounts['WebPage'] || 0;
    if (webPageCount !== 1) {
      this.results.push({
        route,
        check: 'WebPage uniqueness',
        status: 'fail',
        message: `Expected exactly 1 WebPage, found ${webPageCount}`
      });
    } else {
      // Check WebPage has proper @id and primaryImageOfPage if applicable
      const webPageData = jsonLdData.find(item => item['@type'] === 'WebPage');
      if (webPageData) {
        const hasValidId = webPageData['@id']?.includes('#webpage');
        this.results.push({
          route,
          check: 'WebPage @id format',
          status: hasValidId ? 'pass' : 'fail',
          message: hasValidId ? undefined : 'WebPage @id should end with #webpage'
        });
      }
    }

    // Route-specific checks
    if (route === '/diensten') {
      // Check for FAQPage
      const faqCount = typeCounts['FAQPage'] || 0;
      this.results.push({
        route,
        check: 'FAQPage presence',
        status: faqCount >= 1 ? 'pass' : 'fail',
        message: faqCount >= 1 ? undefined : 'FAQPage required on /diensten'
      });

      // Check for Service with Offer (should be 3)
      const serviceCount = jsonLdData.filter(item => 
        item['@type'] === 'Service' && item.offers
      ).length;
      this.results.push({
        route,
        check: 'Service with Offer count',
        status: serviceCount === 3 ? 'pass' : 'fail',
        message: serviceCount === 3 ? undefined : `Expected 3 Service with Offer, found ${serviceCount}`
      });

      // Check for OfferCatalog
      const offerCatalogCount = typeCounts['OfferCatalog'] || 0;
      this.results.push({
        route,
        check: 'OfferCatalog presence',
        status: offerCatalogCount >= 1 ? 'pass' : 'fail',
        message: offerCatalogCount >= 1 ? undefined : 'OfferCatalog required on /diensten'
      });
    }

    if (route === '/werkwijze') {
      // Check for exactly one HowTo
      const howToCount = typeCounts['HowTo'] || 0;
      this.results.push({
        route,
        check: 'HowTo presence',
        status: howToCount === 1 ? 'pass' : 'fail',
        message: howToCount === 1 ? undefined : `Expected exactly 1 HowTo, found ${howToCount}`
      });
    }

    // Check Organization and LocalBusiness consistency
    const orgData = jsonLdData.find(item => item['@type'] === 'Organization');
    const businessData = jsonLdData.find(item => item['@type'] === 'LocalBusiness');
    
    if (orgData && businessData) {
      const sameId = orgData['@id'] === businessData['@id'];
      const orgHasServiceArea = !!orgData.areaServed || !!orgData.serviceArea;
      const businessHasServiceArea = !!businessData.areaServed || !!businessData.serviceArea;
      const orgHasContact = !!orgData.contactPoint;
      const businessHasContact = !!businessData.contactPoint;

      this.results.push({
        route,
        check: 'Organization/LocalBusiness @id consistency',
        status: sameId ? 'pass' : 'fail',
        message: sameId ? undefined : 'Organization and LocalBusiness should share the same @id'
      });

      this.results.push({
        route,
        check: 'Organization/LocalBusiness serviceArea',
        status: (orgHasServiceArea && businessHasServiceArea) ? 'pass' : 'fail',
        message: (orgHasServiceArea && businessHasServiceArea) ? undefined : 'Both Organization and LocalBusiness should include serviceArea'
      });

      this.results.push({
        route,
        check: 'Organization/LocalBusiness contactPoint',
        status: (orgHasContact && businessHasContact) ? 'pass' : 'fail',
        message: (orgHasContact && businessHasContact) ? undefined : 'Both Organization and LocalBusiness should include contactPoint'
      });
    }
  }

  /**
   * Check sitemap.xml for hygiene issues
   */
  private async checkSitemap(): Promise<void> {
    try {
      const { html: sitemapContent } = await this.fetchPage('/sitemap.xml');
      
      // Check for fragment URLs
      const hasFragments = sitemapContent.includes('#');
      this.results.push({
        route: '/sitemap.xml',
        check: 'No fragment URLs',
        status: hasFragments ? 'fail' : 'pass',
        message: hasFragments ? 'Sitemap contains URLs with # fragments' : undefined
      });

      // Check for HTTPS URLs
      const httpUrls = sitemapContent.match(/http:\/\/[^\s<]+/g) || [];
      this.results.push({
        route: '/sitemap.xml',
        check: 'HTTPS URLs only',
        status: httpUrls.length === 0 ? 'pass' : 'fail',
        message: httpUrls.length === 0 ? undefined : `Found ${httpUrls.length} HTTP URLs`
      });

      // Check for absolute URLs
      const relativeUrls = sitemapContent.match(/<loc>[^h][^<]+<\/loc>/g) || [];
      this.results.push({
        route: '/sitemap.xml',
        check: 'Absolute URLs only', 
        status: relativeUrls.length === 0 ? 'pass' : 'fail',
        message: relativeUrls.length === 0 ? undefined : `Found ${relativeUrls.length} relative URLs`
      });

    } catch (error) {
      this.results.push({
        route: '/sitemap.xml',
        check: 'Sitemap accessibility',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check robots.txt accessibility
   */
  private async checkRobotsTxt(): Promise<void> {
    try {
      const { html: robotsContent, status } = await this.fetchPage('/robots.txt');
      
      this.results.push({
        route: '/robots.txt',
        check: 'Robots.txt accessibility',
        status: status === 200 ? 'pass' : 'fail',
        message: status === 200 ? undefined : `HTTP ${status}`
      });

      // Basic robots.txt validation
      if (status === 200) {
        const hasUserAgent = robotsContent.toLowerCase().includes('user-agent:');
        this.results.push({
          route: '/robots.txt',
          check: 'Valid robots.txt format',
          status: hasUserAgent ? 'pass' : 'fail',
          message: hasUserAgent ? undefined : 'Missing User-agent directive'
        });
      }

    } catch (error) {
      this.results.push({
        route: '/robots.txt',
        check: 'Robots.txt accessibility',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check internal anchor links on specific pages
   */
  private async checkInternalLinks(): Promise<void> {
    const anchorPages = ['/', '/diensten'];
    
    for (const route of anchorPages) {
      try {
        const { html } = await this.fetchPage(route);
        const $ = cheerio.load(html);
        
        // Find internal anchor links to specific IDs
        const anchorLinks = $('a[href*="#"]').toArray()
          .map(el => $(el).attr('href'))
          .filter(href => href && (href.includes('#website') || href.includes('#webshop') || href.includes('#seo')))
          .filter((href, index, array) => array.indexOf(href) === index); // unique only

        for (const link of anchorLinks) {
          if (link?.startsWith('/diensten#')) {
            try {
              const response = await request(`${BASE_URL}${link}`, {
                method: 'HEAD',
                headersTimeout: REQUEST_TIMEOUT,
                bodyTimeout: REQUEST_TIMEOUT
              });
              
              this.results.push({
                route,
                check: `Internal link ${link}`,
                status: response.statusCode === 200 ? 'pass' : 'fail',
                message: response.statusCode === 200 ? undefined : `HTTP ${response.statusCode}`
              });
            } catch (error) {
              this.results.push({
                route,
                check: `Internal link ${link}`,
                status: 'fail',
                message: error instanceof Error ? error.message : 'Unknown error'
              });
            }
          }
        }
      } catch (error) {
        this.results.push({
          route,
          check: 'Internal links analysis',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Check robots meta tags
   */
  private checkRobotsMeta(route: string, html: string): void {
    const $ = cheerio.load(html);
    const robotsMeta = $('meta[name="robots"]').attr('content');
    
    // In production, ensure no accidental noindex on canonical pages
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    const canonicalPages = ['/', '/diensten', '/werkwijze', '/over-ons', '/contact'];
    
    if (isProduction && canonicalPages.includes(route)) {
      const hasNoIndex = robotsMeta && robotsMeta.toLowerCase().includes('noindex');
      this.results.push({
        route,
        check: 'Robots meta (no accidental noindex)',
        status: hasNoIndex ? 'fail' : 'pass',
        message: hasNoIndex ? `Found noindex on canonical page: ${robotsMeta}` : undefined
      });
    } else {
      // In preview/development, just check presence
      this.results.push({
        route,
        check: 'Robots meta presence',
        status: 'pass',
        message: robotsMeta ? `Content: ${robotsMeta}` : 'No robots meta found'
      });
    }
  }

  /**
   * Run all checks for a specific route
   */
  private async checkRoute(route: string): Promise<void> {
    console.log(`🔍 Checking route: ${route}`);
    
    try {
      const { html, status } = await this.fetchPage(route);
      
      if (status !== 200) {
        this.results.push({
          route,
          check: 'Page accessibility',
          status: 'fail',
          message: `HTTP ${status}`
        });
        return;
      }

      this.results.push({
        route,
        check: 'Page accessibility', 
        status: 'pass'
      });

      // Run all checks for this route
      this.checkStructuredData(route, html);
      this.checkRobotsMeta(route, html);

    } catch (error) {
      this.results.push({
        route,
        check: 'Page accessibility',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Print results in a compact table format
   */
  private printResults(): void {
    console.log('\n📊 SEO Preflight Check Results\n');
    
    const groupedResults = this.results.reduce((acc, result) => {
      if (!acc[result.route]) {
        acc[result.route] = [];
      }
      acc[result.route].push(result);
      return acc;
    }, {} as Record<string, CheckResult[]>);

    Object.entries(groupedResults).forEach(([route, checks]) => {
      console.log(`\n📄 ${route}`);
      console.log('─'.repeat(60));
      
      checks.forEach(check => {
        const icon = check.status === 'pass' ? '✅' : '❌';
        const message = check.message ? ` - ${check.message}` : '';
        console.log(`${icon} ${check.check}${message}`);
      });
    });

    const failedChecks = this.results.filter(r => r.status === 'fail');
    const totalChecks = this.results.length;
    const passedChecks = totalChecks - failedChecks.length;

    console.log('\n📈 Summary');
    console.log('─'.repeat(60));
    console.log(`Total checks: ${totalChecks}`);
    console.log(`Passed: ${passedChecks}`);
    console.log(`Failed: ${failedChecks.length}`);

    if (failedChecks.length > 0) {
      console.log('\n❌ Failed Checks:');
      failedChecks.forEach(check => {
        console.log(`  • ${check.route}: ${check.check} - ${check.message || 'Failed'}`);
      });
    }
  }

  /**
   * Run all preflight checks
   */
  async run(): Promise<void> {
    try {
      // Start the server
      this.serverProcess = await this.startServer();
      
      // Wait for server to be ready
      await this.waitForServer();

      console.log('🔍 Running SEO preflight checks...\n');

      // Check all routes
      for (const route of ROUTES) {
        await this.checkRoute(route);
      }

      // Check sitemap and robots.txt
      await this.checkSitemap();
      await this.checkRobotsTxt();

      // Check internal links
      await this.checkInternalLinks();

      // Print results
      this.printResults();

      // Exit with appropriate code
      const failedChecks = this.results.filter(r => r.status === 'fail');
      if (failedChecks.length > 0) {
        console.log(`\n💥 SEO preflight failed with ${failedChecks.length} errors`);
        process.exit(1);
      } else {
        console.log('\n🎉 All SEO preflight checks passed!');
        process.exit(0);
      }

    } catch (error) {
      console.error('\n💥 SEO preflight check failed:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    } finally {
      // Cleanup server
      if (this.serverProcess) {
        console.log('\n🛑 Stopping server...');
        this.serverProcess.cleanup();
      }
    }
  }
}

// Run the checker if this script is executed directly
if (require.main === module) {
  const checker = new SEOPreflightChecker();
  checker.run();
}

export default SEOPreflightChecker;