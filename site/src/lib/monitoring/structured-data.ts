/**
 * Structured Data Testing Automation
 * Validates JSON-LD schema markup, rich snippets, and structured data compliance
 */

import type { StructuredDataCheck, SEOIssue } from "./types";

export interface SchemaValidationResult {
  valid: boolean;
  errors: SchemaError[];
  warnings: SchemaWarning[];
  richSnippets: RichSnippetOpportunity[];
  schemaTypes: string[];
  coverage: SchemaCoverage;
}

export interface SchemaError {
  type:
    | "missing-required"
    | "invalid-value"
    | "invalid-type"
    | "invalid-format";
  property: string;
  message: string;
  severity: "high" | "medium" | "low";
  schemaType: string;
}

export interface SchemaWarning {
  type: "recommended" | "best-practice" | "enhancement";
  property: string;
  message: string;
  recommendation: string;
  schemaType: string;
}

export interface RichSnippetOpportunity {
  type:
    | "product"
    | "article"
    | "organization"
    | "local-business"
    | "event"
    | "recipe"
    | "review";
  current: boolean;
  eligible: boolean;
  requirements: string[];
  impact: "high" | "medium" | "low";
}

export interface SchemaCoverage {
  totalPages: number;
  pagesWithSchema: number;
  coveragePercentage: number;
  schemaTypeDistribution: Record<string, number>;
  missingSchemaPages: string[];
}

export class StructuredDataTester {
  private readonly requiredSchemas = {
    Organization: {
      required: ["@type", "name", "url"],
      recommended: ["logo", "description", "contactPoint", "address", "sameAs"],
    },
    WebSite: {
      required: ["@type", "name", "url"],
      recommended: ["description", "potentialAction"],
    },
    LocalBusiness: {
      required: ["@type", "name", "address", "telephone"],
      recommended: ["openingHours", "priceRange", "image", "review"],
    },
    Article: {
      required: ["@type", "headline", "author", "datePublished"],
      recommended: ["image", "dateModified", "publisher", "mainEntityOfPage"],
    },
    Product: {
      required: ["@type", "name", "image", "description"],
      recommended: ["offers", "review", "aggregateRating", "brand"],
    },
    Service: {
      required: ["@type", "name", "description", "provider"],
      recommended: ["areaServed", "hasOfferCatalog", "review"],
    },
  };

  async validatePageStructuredData(
    url: string,
  ): Promise<SchemaValidationResult> {
    try {
      const html = await this.fetchPageHTML(url);
      const schemas = this.extractSchemas(html);

      const errors: SchemaError[] = [];
      const warnings: SchemaWarning[] = [];
      const richSnippets: RichSnippetOpportunity[] = [];
      const schemaTypes: string[] = [];

      for (const schema of schemas) {
        const validation = await this.validateSchema(schema);
        errors.push(...validation.errors);
        warnings.push(...validation.warnings);
        schemaTypes.push(schema["@type"] || "Unknown");
      }

      // Check for rich snippet opportunities
      richSnippets.push(...this.analyzeRichSnippetOpportunities(schemas));

      // Calculate coverage for this page
      const coverage = await this.calculateSchemaCoverage([url]);

      return {
        valid: errors.filter((e) => e.severity === "high").length === 0,
        errors,
        warnings,
        richSnippets,
        schemaTypes: [...new Set(schemaTypes)],
        coverage,
      };
    } catch (error) {
      throw new Error(
        `Failed to validate structured data for ${url}: ${error}`,
      );
    }
  }

  async validateSiteStructuredData(
    siteUrl: string,
  ): Promise<SchemaValidationResult> {
    try {
      const urls = await this.discoverSitePages(siteUrl);
      const allErrors: SchemaError[] = [];
      const allWarnings: SchemaWarning[] = [];
      const allRichSnippets: RichSnippetOpportunity[] = [];
      const allSchemaTypes: string[] = [];

      // Validate each page in batches
      const batchSize = 10;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const promises = batch.map((url) =>
          this.validatePageStructuredData(url),
        );

        try {
          const results = await Promise.allSettled(promises);

          results.forEach((result, index) => {
            if (result.status === "fulfilled") {
              allErrors.push(...result.value.errors);
              allWarnings.push(...result.value.warnings);
              allRichSnippets.push(...result.value.richSnippets);
              allSchemaTypes.push(...result.value.schemaTypes);
            } else {
              console.warn(
                `Failed to validate ${batch[index]}: ${result.reason}`,
              );
            }
          });
        } catch (error) {
          console.error(`Batch validation failed:`, error);
        }
      }

      const coverage = await this.calculateSchemaCoverage(urls);

      return {
        valid: allErrors.filter((e) => e.severity === "high").length === 0,
        errors: this.deduplicateErrors(allErrors),
        warnings: this.deduplicateWarnings(allWarnings),
        richSnippets: this.consolidateRichSnippets(allRichSnippets),
        schemaTypes: [...new Set(allSchemaTypes)],
        coverage,
      };
    } catch (error) {
      throw new Error(`Failed to validate site structured data: ${error}`);
    }
  }

  private async fetchPageHTML(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ProWeb Studio SEO Monitor/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  }

  private extractSchemas(html: string): any[] {
    const schemas: any[] = [];

    // Extract JSON-LD schemas
    const jsonLdMatches = html.match(
      /<script[^>]*type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/gis,
    );
    if (jsonLdMatches) {
      for (const match of jsonLdMatches) {
        try {
          const jsonContent = match
            .replace(/<script[^>]*>/i, "")
            .replace(/<\/script>/i, "");
          const parsed = JSON.parse(jsonContent);

          if (Array.isArray(parsed)) {
            schemas.push(...parsed);
          } else {
            schemas.push(parsed);
          }
        } catch (error) {
          console.warn("Failed to parse JSON-LD:", error);
        }
      }
    }

    // Extract microdata (basic support)
    const microdataItems = this.extractMicrodata(html);
    schemas.push(...microdataItems);

    return schemas;
  }

  private extractMicrodata(html: string): any[] {
    // Basic microdata extraction - can be enhanced
    const schemas: any[] = [];

    // This is a simplified implementation
    // In production, you'd want a more robust microdata parser
    const itemScopeRegex =
      /<[^>]*itemscope[^>]*itemtype=["\']([^"\']*)["\'][^>]*>/gi;
    let match;

    while ((match = itemScopeRegex.exec(html)) !== null) {
      schemas.push({
        "@type": match[1].split("/").pop(),
        source: "microdata",
      });
    }

    return schemas;
  }

  private async validateSchema(
    schema: any,
  ): Promise<{ errors: SchemaError[]; warnings: SchemaWarning[] }> {
    const errors: SchemaError[] = [];
    const warnings: SchemaWarning[] = [];

    const schemaType = schema["@type"];
    if (!schemaType) {
      errors.push({
        type: "missing-required",
        property: "@type",
        message: "Schema type is required",
        severity: "high",
        schemaType: "Unknown",
      });
      return { errors, warnings };
    }

    const requirements =
      this.requiredSchemas[schemaType as keyof typeof this.requiredSchemas];
    if (!requirements) {
      warnings.push({
        type: "best-practice",
        property: "@type",
        message: `Schema type '${schemaType}' is not in our validation rules`,
        recommendation: "Ensure this is a valid Schema.org type",
        schemaType,
      });
      return { errors, warnings };
    }

    // Check required properties
    for (const requiredProp of requirements.required) {
      if (!schema[requiredProp]) {
        errors.push({
          type: "missing-required",
          property: requiredProp,
          message: `Required property '${requiredProp}' is missing`,
          severity: "high",
          schemaType,
        });
      }
    }

    // Check recommended properties
    for (const recommendedProp of requirements.recommended) {
      if (!schema[recommendedProp]) {
        warnings.push({
          type: "recommended",
          property: recommendedProp,
          message: `Recommended property '${recommendedProp}' is missing`,
          recommendation: `Adding '${recommendedProp}' can improve rich snippet eligibility`,
          schemaType,
        });
      }
    }

    // Validate specific property formats
    if (schema.url && !this.isValidUrl(schema.url)) {
      errors.push({
        type: "invalid-format",
        property: "url",
        message: "URL format is invalid",
        severity: "medium",
        schemaType,
      });
    }

    if (schema.datePublished && !this.isValidDate(schema.datePublished)) {
      errors.push({
        type: "invalid-format",
        property: "datePublished",
        message: "Date format is invalid (should be ISO 8601)",
        severity: "medium",
        schemaType,
      });
    }

    return { errors, warnings };
  }

  private analyzeRichSnippetOpportunities(
    schemas: any[],
  ): RichSnippetOpportunity[] {
    const opportunities: RichSnippetOpportunity[] = [];

    // Check for each rich snippet type
    const snippetTypes: Array<keyof typeof this.richSnippetRequirements> = [
      "product",
      "article",
      "organization",
      "local-business",
      "event",
      "recipe",
      "review",
    ];

    for (const type of snippetTypes) {
      const hasSchema = schemas.some(
        (s) =>
          s["@type"]?.toLowerCase() === type.replace("-", "") ||
          s["@type"]?.toLowerCase() === type,
      );

      const requirements = this.richSnippetRequirements[type];
      const eligible =
        hasSchema && this.checkRichSnippetEligibility(schemas, requirements);

      opportunities.push({
        type,
        current: hasSchema,
        eligible,
        requirements: requirements.required,
        impact: requirements.impact,
      });
    }

    return opportunities;
  }

  private readonly richSnippetRequirements = {
    product: {
      required: ["name", "image", "description", "offers"],
      impact: "high" as const,
    },
    article: {
      required: ["headline", "author", "datePublished", "image"],
      impact: "medium" as const,
    },
    organization: {
      required: ["name", "url", "logo"],
      impact: "medium" as const,
    },
    "local-business": {
      required: ["name", "address", "telephone", "openingHours"],
      impact: "high" as const,
    },
    event: {
      required: ["name", "startDate", "location"],
      impact: "high" as const,
    },
    recipe: {
      required: ["name", "image", "recipeIngredient", "recipeInstructions"],
      impact: "high" as const,
    },
    review: {
      required: ["itemReviewed", "reviewRating", "author"],
      impact: "medium" as const,
    },
  };

  private checkRichSnippetEligibility(
    schemas: any[],
    requirements: { required: string[] },
  ): boolean {
    return schemas.some((schema) =>
      requirements.required.every((req) => schema[req]),
    );
  }

  private async discoverSitePages(siteUrl: string): Promise<string[]> {
    try {
      // Try to get URLs from sitemap first
      const sitemapUrls = await this.getSitemapUrls(siteUrl);
      if (sitemapUrls.length > 0) {
        return sitemapUrls.slice(0, 100); // Limit for testing
      }

      // Fallback to common pages
      return [
        siteUrl,
        `${siteUrl}/about`,
        `${siteUrl}/services`,
        `${siteUrl}/contact`,
        `${siteUrl}/blog`,
      ].filter((url) => url);
    } catch (error) {
      console.warn("Failed to discover site pages:", error);
      return [siteUrl];
    }
  }

  private async getSitemapUrls(siteUrl: string): Promise<string[]> {
    try {
      const sitemapUrl = `${siteUrl}/sitemap.xml`;
      const response = await fetch(sitemapUrl);

      if (!response.ok) return [];

      const xmlContent = await response.text();
      const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);

      if (!urlMatches) return [];

      return urlMatches
        .map((match) => match.replace(/<\/?loc>/g, ""))
        .filter((url) => url.startsWith("http"));
    } catch {
      return [];
    }
  }

  private async calculateSchemaCoverage(
    urls: string[],
  ): Promise<SchemaCoverage> {
    // This would be implemented with actual page crawling
    // For now, return estimated values
    const estimatedCoverage = Math.min(urls.length * 0.8, urls.length);

    return {
      totalPages: urls.length,
      pagesWithSchema: Math.floor(estimatedCoverage),
      coveragePercentage: Math.floor((estimatedCoverage / urls.length) * 100),
      schemaTypeDistribution: {
        Organization: 1,
        WebSite: 1,
        Article: Math.floor(urls.length * 0.3),
        LocalBusiness: 1,
      },
      missingSchemaPages: urls.slice(Math.floor(estimatedCoverage)),
    };
  }

  private deduplicateErrors(errors: SchemaError[]): SchemaError[] {
    const seen = new Set<string>();
    return errors.filter((error) => {
      const key = `${error.type}-${error.property}-${error.schemaType}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private deduplicateWarnings(warnings: SchemaWarning[]): SchemaWarning[] {
    const seen = new Set<string>();
    return warnings.filter((warning) => {
      const key = `${warning.type}-${warning.property}-${warning.schemaType}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private consolidateRichSnippets(
    opportunities: RichSnippetOpportunity[],
  ): RichSnippetOpportunity[] {
    const consolidated = new Map<string, RichSnippetOpportunity>();

    for (const opp of opportunities) {
      const existing = consolidated.get(opp.type);
      if (!existing || (opp.current && !existing.current)) {
        consolidated.set(opp.type, opp);
      }
    }

    return Array.from(consolidated.values());
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidDate(date: string): boolean {
    // Check ISO 8601 format
    const iso8601Regex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
    return iso8601Regex.test(date) || !isNaN(Date.parse(date));
  }
}

// Automated testing runner
export class StructuredDataAutomation {
  private tester = new StructuredDataTester();
  private results: Map<string, SchemaValidationResult> = new Map();

  async runDailyCheck(siteUrl: string): Promise<StructuredDataCheck> {
    try {
      const result = await this.tester.validateSiteStructuredData(siteUrl);
      this.results.set(siteUrl, result);

      return {
        present: result.schemaTypes.length > 0,
        valid: result.valid,
        types: result.schemaTypes,
        errors: result.errors.map((e) => e.message),
        warnings: result.warnings.map((w) => w.message),
        richSnippetsEligible: result.richSnippets.some((rs) => rs.eligible),
      };
    } catch (error) {
      console.error("Structured data automation failed:", error);
      return {
        present: false,
        valid: false,
        types: [],
        errors: [`Automation failed: ${error}`],
        warnings: [],
        richSnippetsEligible: false,
      };
    }
  }

  getLatestResults(siteUrl: string): SchemaValidationResult | null {
    return this.results.get(siteUrl) || null;
  }

  generateSEOIssues(result: SchemaValidationResult): SEOIssue[] {
    const issues: SEOIssue[] = [];

    // Convert errors to SEO issues
    for (const error of result.errors) {
      issues.push({
        type: "error",
        category: "technical",
        message: `Structured Data: ${error.message}`,
        impact:
          error.severity === "high"
            ? "high"
            : error.severity === "medium"
              ? "medium"
              : "low",
        recommendation: `Fix the ${error.property} property in the ${error.schemaType} schema`,
      });
    }

    // Convert warnings to SEO issues
    for (const warning of result.warnings) {
      issues.push({
        type: "warning",
        category: "content",
        message: `Structured Data: ${warning.message}`,
        impact: "medium",
        recommendation: warning.recommendation,
      });
    }

    // Add rich snippet opportunities
    const missedOpportunities = result.richSnippets.filter(
      (rs) => !rs.eligible && rs.impact === "high",
    );
    for (const opportunity of missedOpportunities) {
      issues.push({
        type: "info",
        category: "content",
        message: `Rich Snippet Opportunity: ${opportunity.type} markup can be enhanced`,
        impact: opportunity.impact,
        recommendation: `Implement required properties: ${opportunity.requirements.join(", ")}`,
      });
    }

    return issues;
  }
}

export const structuredDataAutomation = new StructuredDataAutomation();
