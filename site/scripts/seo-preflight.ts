#!/usr/bin/env ts-node
/**
 * SEO/Performance Preflight Check Script (Hardened)
 * 
 * This script performs automated checks on the built Next.js application to ensure:
 * - Structured data uniqueness and completeness with robust JSON-LD parsing
 * - Sitemap hygiene  
 * - Internal link integrity with DOM-level validation
 * - Robots meta compliance
 * - Server lifecycle management with clean shutdown
 * 
 * Usage: npm run seo:preflight (after npm run build)
 */

import { spawn, exec } from 'child_process';
import { request } from 'undici';
import * as cheerio from 'cheerio';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
  cleanup: () => Promise<void>;
}

interface JsonLdNode {
  '@type'?: string | string[];
  '@id'?: string;
  [key: string]: any;
}

class JsonLdHelper {
  private nodes: JsonLdNode[];

  constructor(nodes: JsonLdNode[]) {
    this.nodes = nodes;
  }

  /**
   * Find nodes by @type, handling both string and array values
   */
  byType(type: string): JsonLdNode[] {
    return this.nodes.filter(node => {
      const nodeType = node['@type'];
      if (Array.isArray(nodeType)) {
        return nodeType.includes(type);
      }
      return nodeType === type;
    });
  }

  /**
   * Find nodes by @id
   */
  byId(id: string): JsonLdNode[] {
    return this.nodes.filter(node => node['@id'] === id);
  }

  /**
   * Get all nodes
   */
  getAll(): JsonLdNode[] {
    return this.nodes;
  }

  /**
   * Get type counts for debugging
   */
  getTypeCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.nodes.forEach(node => {
      const type = node['@type'];
      if (type) {
        if (Array.isArray(type)) {
          type.forEach(t => {
            counts[t] = (counts[t] || 0) + 1;
          });
        } else {
          counts[type] = (counts[type] || 0) + 1;
        }
      }
    });
    return counts;
  }
}

class SEOPreflightChecker {
  private results: CheckResult[] = [];
  private serverProcess: ServerProcess | null = null;

  /**
   * Start Next.js server on specified port with enhanced cleanup
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

      const cleanup = async (): Promise<void> => {
        clearTimeout(timeout);
        if (nextProcess && !nextProcess.killed) {
          console.log('🛑 Sending SIGTERM to server...');
          nextProcess.kill('SIGTERM');
          
          // Wait 5 seconds for graceful shutdown
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          if (!nextProcess.killed) {
            console.log('🛑 Force killing server...');
            nextProcess.kill('SIGKILL');
          }
          
          // Fallback: use pkill to ensure cleanup
          try {
            await execAsync(`pkill -f "next start"`);
          } catch (error) {
            // Ignore pkill errors - process might already be dead
          }
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
          'User-Agent': 'SEO-Preflight-Checker/2.0'
        }
      });
      
      const html = await response.body.text();
      return { html, status: response.statusCode };
    } catch (error) {
      throw new Error(`Failed to fetch ${route}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse and validate JSON-LD structured data with robust graph flattening
   */
  private parseJsonLd(html: string): JsonLdHelper {
    const $ = cheerio.load(html);
    const jsonLdScripts = $('script[type="application/ld+json"]');
    const allNodes: JsonLdNode[] = [];

    jsonLdScripts.each((_, script) => {
      try {
        const content = $(script).html();
        if (content) {
          const parsed = JSON.parse(content);
          
          // Handle @graph arrays
          if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
            allNodes.push(...parsed['@graph']);
          }
          // Handle single objects
          else if (typeof parsed === 'object' && parsed !== null) {
            if (Array.isArray(parsed)) {
              allNodes.push(...parsed);
            } else {
              allNodes.push(parsed);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️  Failed to parse JSON-LD: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return new JsonLdHelper(allNodes);
  }

  /**
   * Check structured data requirements for a specific route with enhanced validation
   */
  private checkStructuredData(route: string, html: string): void {
    const jsonLdHelper = this.parseJsonLd(html);
    const typeCounts = jsonLdHelper.getTypeCounts();
    
    // Enhanced debugging info
    if (Object.keys(typeCounts).length > 0) {
      console.log(`📊 Schema types found on ${route}:`, typeCounts);
    }

    // 1. Singleton checks - BreadcrumbList (all pages)
    const breadcrumbNodes = jsonLdHelper.byType('BreadcrumbList');
    if (breadcrumbNodes.length !== 1) {
      this.results.push({
        route,
        check: 'BreadcrumbList uniqueness',
        status: 'fail',
        message: `Expected exactly 1 BreadcrumbList, found ${breadcrumbNodes.length}. IDs: [${breadcrumbNodes.map(n => n['@id'] || 'no-id').join(', ')}]`
      });
    } else {
      this.results.push({
        route,
        check: 'BreadcrumbList uniqueness',
        status: 'pass'
      });
    }

    // 2. Singleton checks - WebPage (all pages)
    const webPageNodes = jsonLdHelper.byType('WebPage');
    if (webPageNodes.length !== 1) {
      this.results.push({
        route,
        check: 'WebPage uniqueness',
        status: 'fail',
        message: `Expected exactly 1 WebPage, found ${webPageNodes.length}. IDs: [${webPageNodes.map(n => n['@id'] || 'no-id').join(', ')}]`
      });
    } else {
      this.results.push({
        route,
        check: 'WebPage uniqueness',
        status: 'pass'
      });

      // Validate WebPage @id format
      const webPageData = webPageNodes[0];
      const hasValidId = webPageData['@id']?.includes('#webpage');
      this.results.push({
        route,
        check: 'WebPage @id format',
        status: hasValidId ? 'pass' : 'fail',
        message: hasValidId ? undefined : `WebPage @id should end with #webpage, found: ${webPageData['@id']}`
      });

      // Check primaryImageOfPage if present
      if (webPageData.primaryImageOfPage) {
        const imageRef = webPageData.primaryImageOfPage;
        let imageNode = null;
        
        if (typeof imageRef === 'string') {
          imageNode = jsonLdHelper.byId(imageRef)[0];
        } else if (imageRef['@id']) {
          imageNode = jsonLdHelper.byId(imageRef['@id'])[0];
        } else if (imageRef['@type'] === 'ImageObject') {
          imageNode = imageRef;
        }

        if (imageNode) {
          const hasValidImageId = imageNode['@id']?.includes('#primaryimage');
          this.results.push({
            route,
            check: 'WebPage primaryImageOfPage format',
            status: hasValidImageId ? 'pass' : 'fail',
            message: hasValidImageId ? undefined : `Primary image @id should end with #primaryimage, found: ${imageNode['@id']}`
          });
        }
      }
    }

    // 3. Route-specific checks for /diensten
    if (route === '/diensten') {
      // FAQPage (required on diensten)
      const faqNodes = jsonLdHelper.byType('FAQPage');
      if (faqNodes.length !== 1) {
        this.results.push({
          route,
          check: 'FAQPage uniqueness',
          status: 'fail',
          message: `Expected exactly 1 FAQPage on /diensten, found ${faqNodes.length}. IDs: [${faqNodes.map(n => n['@id'] || 'no-id').join(', ')}]`
        });
      } else {
        this.results.push({
          route,
          check: 'FAQPage uniqueness',
          status: 'pass'
        });
      }

      // Service nodes with proper offers (should be exactly 3)
      const serviceNodes = jsonLdHelper.byType('Service');
      if (serviceNodes.length !== 3) {
        this.results.push({
          route,
          check: 'Service count',
          status: 'fail',
          message: `Expected exactly 3 Service nodes, found ${serviceNodes.length}. IDs: [${serviceNodes.map(n => n['@id'] || 'no-id').join(', ')}]`
        });
      } else {
        this.results.push({
          route,
          check: 'Service count',
          status: 'pass'
        });

        // Validate each service's offers
        const validServices = serviceNodes.filter(service => {
          const offers = service.offers;
          if (!offers) return false;
          
          const offer = Array.isArray(offers) ? offers[0] : offers;
          return (
            offer['@type'] === 'Offer' &&
            offer.category === 'service' &&
            offer.availability === 'https://schema.org/InStock' &&
            offer.eligibleRegion === 'NL' &&
            (offer.url?.includes('#website') || offer.url?.includes('#webshop') || offer.url?.includes('#seo'))
          );
        });

        this.results.push({
          route,
          check: 'Service offers validation',
          status: validServices.length === 3 ? 'pass' : 'fail',
          message: validServices.length === 3 ? undefined : `Expected 3 valid Service offers, found ${validServices.length}`
        });
      }

      // OfferCatalog validation
      const catalogNodes = jsonLdHelper.byType('OfferCatalog');
      if (catalogNodes.length === 0) {
        this.results.push({
          route,
          check: 'OfferCatalog presence',
          status: 'fail',
          message: 'OfferCatalog required on /diensten'
        });
      } else {
        this.results.push({
          route,
          check: 'OfferCatalog presence',
          status: 'pass'
        });

        // Validate catalog has 3 items
        const catalog = catalogNodes[0];
        const itemCount = catalog.itemListElement?.length || 0;
        this.results.push({
          route,
          check: 'OfferCatalog item count',
          status: itemCount === 3 ? 'pass' : 'fail',
          message: itemCount === 3 ? undefined : `Expected 3 items in OfferCatalog, found ${itemCount}`
        });
      }
    }

    // 4. Route-specific checks for /werkwijze
    if (route === '/werkwijze') {
      const howToNodes = jsonLdHelper.byType('HowTo');
      if (howToNodes.length !== 1) {
        this.results.push({
          route,
          check: 'HowTo uniqueness',
          status: 'fail',
          message: `Expected exactly 1 HowTo on /werkwijze, found ${howToNodes.length}. IDs: [${howToNodes.map(n => n['@id'] || 'no-id').join(', ')}]`
        });
      } else {
        this.results.push({
          route,
          check: 'HowTo uniqueness',
          status: 'pass'
        });
      }
    }

    // 5. Organization and LocalBusiness consistency
    const orgNodes = jsonLdHelper.byType('Organization');
    const businessNodes = jsonLdHelper.byType('LocalBusiness');
    
    if (orgNodes.length > 0 && businessNodes.length > 0) {
      const orgData = orgNodes[0];
      const businessData = businessNodes[0];
      
      // Check if they share the same @id
      const sameId = orgData['@id'] === businessData['@id'];
      this.results.push({
        route,
        check: 'Organization/LocalBusiness @id consistency',
        status: sameId ? 'pass' : 'fail',
        message: sameId ? undefined : `Organization @id: ${orgData['@id']}, LocalBusiness @id: ${businessData['@id']}`
      });

      // Check serviceArea requirements (12 DefinedRegion with addressCountry: "NL")
      this.validateServiceArea(route, orgData, 'Organization');
      this.validateServiceArea(route, businessData, 'LocalBusiness');

      // Check contactPoint requirements
      this.validateContactPoint(route, orgData, 'Organization');
      this.validateContactPoint(route, businessData, 'LocalBusiness');

      // Check potentialAction (ScheduleAction)
      this.validatePotentialAction(route, orgData, 'Organization');
      this.validatePotentialAction(route, businessData, 'LocalBusiness');
    }
  }

  /**
   * Validate serviceArea requirements
   */
  private validateServiceArea(route: string, data: JsonLdNode, entityType: string): void {
    const serviceArea = data.serviceArea || data.areaServed;
    
    if (!serviceArea) {
      this.results.push({
        route,
        check: `${entityType} serviceArea presence`,
        status: 'fail',
        message: 'Missing serviceArea or areaServed'
      });
      return;
    }

    // Check for 12 DefinedRegion with addressCountry: "NL"
    if (Array.isArray(serviceArea)) {
      const validRegions = serviceArea.filter(region => 
        region['@type'] === 'DefinedRegion' && region.addressCountry === 'NL'
      );
      
      this.results.push({
        route,
        check: `${entityType} serviceArea validation`,
        status: validRegions.length === 12 ? 'pass' : 'fail',
        message: validRegions.length === 12 ? undefined : `Expected 12 DefinedRegion with addressCountry: "NL", found ${validRegions.length}`
      });
    } else {
      this.results.push({
        route,
        check: `${entityType} serviceArea validation`,
        status: 'fail',
        message: 'serviceArea should be an array of DefinedRegion'
      });
    }
  }

  /**
   * Validate contactPoint requirements
   */
  private validateContactPoint(route: string, data: JsonLdNode, entityType: string): void {
    const contactPoint = data.contactPoint;
    
    if (!contactPoint) {
      this.results.push({
        route,
        check: `${entityType} contactPoint presence`,
        status: 'fail',
        message: 'Missing contactPoint'
      });
      return;
    }

    const contacts = Array.isArray(contactPoint) ? contactPoint : [contactPoint];
    const salesContact = contacts.find(contact => contact.contactType === 'sales');
    
    if (!salesContact) {
      this.results.push({
        route,
        check: `${entityType} sales contactPoint`,
        status: 'fail',
        message: 'Missing contactPoint with contactType: "sales"'
      });
      return;
    }

    // Check availableLanguage
    const hasValidLanguages = salesContact.availableLanguage && 
      Array.isArray(salesContact.availableLanguage) &&
      salesContact.availableLanguage.includes('nl') &&
      salesContact.availableLanguage.includes('en');

    this.results.push({
      route,
      check: `${entityType} contactPoint languages`,
      status: hasValidLanguages ? 'pass' : 'fail',
      message: hasValidLanguages ? undefined : 'Sales contactPoint should have availableLanguage: ["nl", "en"]'
    });

    // Check areaServed
    const hasAreaServed = salesContact.areaServed === 'NL';
    this.results.push({
      route,
      check: `${entityType} contactPoint areaServed`,
      status: hasAreaServed ? 'pass' : 'fail',
      message: hasAreaServed ? undefined : 'Sales contactPoint should have areaServed: "NL"'
    });

    // Check URL to /contact
    const hasContactUrl = salesContact.url && salesContact.url.includes('/contact');
    this.results.push({
      route,
      check: `${entityType} contactPoint URL`,
      status: hasContactUrl ? 'pass' : 'fail',
      message: hasContactUrl ? undefined : 'Sales contactPoint should have URL pointing to /contact'
    });
  }

  /**
   * Validate potentialAction requirements
   */
  private validatePotentialAction(route: string, data: JsonLdNode, entityType: string): void {
    const potentialAction = data.potentialAction;
    
    if (!potentialAction) {
      this.results.push({
        route,
        check: `${entityType} potentialAction presence`,
        status: 'fail',
        message: 'Missing potentialAction'
      });
      return;
    }

    const actions = Array.isArray(potentialAction) ? potentialAction : [potentialAction];
    const scheduleAction = actions.find(action => action['@type'] === 'ScheduleAction');
    
    if (!scheduleAction) {
      this.results.push({
        route,
        check: `${entityType} ScheduleAction`,
        status: 'fail',
        message: 'Missing ScheduleAction in potentialAction'
      });
      return;
    }

    // Check EntryPoint target
    const target = scheduleAction.target;
    if (!target || target['@type'] !== 'EntryPoint') {
      this.results.push({
        route,
        check: `${entityType} ScheduleAction target`,
        status: 'fail',
        message: 'ScheduleAction target should be an EntryPoint'
      });
      return;
    }

    const hasValidUrlTemplate = target.urlTemplate && target.urlTemplate.includes('/contact');
    this.results.push({
      route,
      check: `${entityType} ScheduleAction urlTemplate`,
      status: hasValidUrlTemplate ? 'pass' : 'fail',
      message: hasValidUrlTemplate ? undefined : 'EntryPoint urlTemplate should end with /contact'
    });
  }

  /**
   * Check sitemap.xml for hygiene issues with enhanced validation
   */
  private async checkSitemap(): Promise<void> {
    try {
      const { html: sitemapContent, status } = await this.fetchPage('/sitemap.xml');
      
      if (status !== 200) {
        this.results.push({
          route: '/sitemap.xml',
          check: 'Sitemap accessibility',
          status: 'fail',
          message: `HTTP ${status}`
        });
        return;
      }

      this.results.push({
        route: '/sitemap.xml',
        check: 'Sitemap accessibility',
        status: 'pass'
      });

      // Check for fragment URLs (no # allowed)
      const hasFragments = sitemapContent.includes('#');
      this.results.push({
        route: '/sitemap.xml',
        check: 'No fragment URLs',
        status: hasFragments ? 'fail' : 'pass',
        message: hasFragments ? 'Sitemap contains URLs with # fragments' : undefined
      });

      // Check for HTTPS URLs only
      const httpUrls = sitemapContent.match(/http:\/\/[^\s<]+/g) || [];
      this.results.push({
        route: '/sitemap.xml',
        check: 'HTTPS URLs only',
        status: httpUrls.length === 0 ? 'pass' : 'fail',
        message: httpUrls.length === 0 ? undefined : `Found ${httpUrls.length} HTTP URLs`
      });

      // Check for absolute URLs only
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
   * Check internal anchor links with DOM-level validation (no HEAD requests on fragments)
   */
  private async checkInternalAnchors(): Promise<void> {
    // Check /diensten for required anchor IDs
    try {
      const { html: dienstenHtml } = await this.fetchPage('/diensten');
      const $ = cheerio.load(dienstenHtml);
      
      const requiredIds = ['website', 'webshop', 'seo'];
      const foundIds = requiredIds.filter(id => $(`#${id}`).length > 0);
      
      this.results.push({
        route: '/diensten',
        check: 'Required anchor IDs presence',
        status: foundIds.length === 3 ? 'pass' : 'fail',
        message: foundIds.length === 3 ? undefined : `Missing IDs: [${requiredIds.filter(id => !foundIds.includes(id)).join(', ')}]`
      });

    } catch (error) {
      this.results.push({
        route: '/diensten',
        check: 'Required anchor IDs presence',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check homepage for internal links to diensten anchors
    try {
      const { html: homepageHtml } = await this.fetchPage('/');
      const $ = cheerio.load(homepageHtml);
      
      const anchorLinks = $('a[href*="/diensten#"]').toArray()
        .map(el => $(el).attr('href'))
        .filter(href => href && (href.includes('#website') || href.includes('#webshop') || href.includes('#seo')))
        .filter((href, index, array) => array.indexOf(href) === index); // unique only

      if (anchorLinks.length > 0) {
        this.results.push({
          route: '/',
          check: 'Internal diensten anchor links',
          status: 'pass',
          message: `Found ${anchorLinks.length} anchor links: [${anchorLinks.join(', ')}]`
        });
      } else {
        this.results.push({
          route: '/',
          check: 'Internal diensten anchor links',
          status: 'pass',
          message: 'No diensten anchor links found (optional)'
        });
      }

    } catch (error) {
      this.results.push({
        route: '/',
        check: 'Internal diensten anchor links',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check robots meta tags with environment-aware validation
   */
  private checkRobotsMeta(route: string, html: string): void {
    const $ = cheerio.load(html);
    const robotsMeta = $('meta[name="robots"]').attr('content');
    
    // Check if we're in preview/staging environment
    const isPreviewOrStaging = process.env.VERCEL_ENV === 'preview' || 
                               process.env.NODE_ENV === 'development' ||
                               process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';
    
    const canonicalPages = ['/', '/diensten', '/werkwijze', '/over-ons', '/contact'];
    
    if (isPreviewOrStaging) {
      // In preview/staging, just report what we found
      this.results.push({
        route,
        check: 'Robots meta (preview/staging)',
        status: 'pass',
        message: robotsMeta ? `Content: ${robotsMeta}` : 'No robots meta found'
      });
    } else if (canonicalPages.includes(route)) {
      // In production, ensure no accidental noindex on canonical pages
      const hasNoIndex = robotsMeta && robotsMeta.toLowerCase().includes('noindex');
      this.results.push({
        route,
        check: 'Robots meta (no accidental noindex)',
        status: hasNoIndex ? 'fail' : 'pass',
        message: hasNoIndex ? `Found noindex on canonical page: ${robotsMeta}` : undefined
      });
    } else {
      // For non-canonical pages, just check presence
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
   * Print results in a compact table format with enhanced debugging
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
      console.log('\n❌ Failed Checks Summary:');
      failedChecks.forEach(check => {
        const reason = check.message || 'Failed';
        console.log(`  • ${check.route}: ${check.check}`);
        console.log(`    └─ ${reason}`);
      });
      
      console.log('\n🔧 Debugging Tips:');
      console.log('  • Schema type counts are logged for each route during execution');
      console.log('  • Failed singleton checks show @id values to identify duplication sources');
      console.log('  • Check server logs above for additional JSON-LD parsing warnings');
    }
  }

  /**
   * Run all preflight checks with enhanced server lifecycle management
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

      // Check internal anchors (DOM-level validation)
      await this.checkInternalAnchors();

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
      // Enhanced cleanup server with timeout fallback
      if (this.serverProcess) {
        console.log('\n🛑 Stopping server...');
        try {
          await this.serverProcess.cleanup();
          console.log('✅ Server stopped gracefully');
        } catch (cleanupError) {
          console.error('⚠️ Server cleanup error:', cleanupError instanceof Error ? cleanupError.message : 'Unknown error');
          
          // Fallback: force kill any remaining processes
          try {
            await execAsync(`pkill -f "next start"`);
            console.log('✅ Server processes force-killed');
          } catch (pkillError) {
            console.error('⚠️ pkill fallback failed:', pkillError instanceof Error ? pkillError.message : 'Unknown error');
          }
        }
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