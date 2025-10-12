#!/usr/bin/env node

/**
 * Comprehensive Cleanup Inventory Script
 *
 * This script performs a dry-run analysis to identify:
 * - Unused exports, functions, types, variables
 * - Unreferenced files and modules
 * - Unused public assets (images, fonts, icons)
 * - Potentially unused dependencies
 * - Placeholder content and comments
 *
 * Outputs a machine-readable JSON report for review before deletion.
 */

import { execSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";

interface UnusedItem {
  type:
    | "export"
    | "function"
    | "type"
    | "variable"
    | "file"
    | "asset"
    | "dependency"
    | "placeholder";
  path: string;
  name?: string;
  line?: number;
  column?: number;
  size?: number;
  reason: string;
  confidence: "high" | "medium" | "low";
  category: string;
}

interface InventoryReport {
  timestamp: string;
  summary: {
    totalFiles: number;
    totalAssets: number;
    totalDependencies: number;
    unusedItems: number;
    estimatedSavings: {
      files: number;
      bytes: number;
    };
  };
  unused: UnusedItem[];
  falsePositives: string[];
  recommendations: string[];
}

class CleanupInventory {
  private projectRoot: string;
  private report: InventoryReport;

  constructor() {
    this.projectRoot = process.cwd();
    this.report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: 0,
        totalAssets: 0,
        totalDependencies: 0,
        unusedItems: 0,
        estimatedSavings: { files: 0, bytes: 0 },
      },
      unused: [],
      falsePositives: [
        "src/app/**/page.tsx - Next.js route files",
        "src/app/**/layout.tsx - Next.js layout files",
        "src/app/**/error.tsx - Next.js error boundaries",
        "src/app/**/loading.tsx - Next.js loading components",
        "src/app/**/not-found.tsx - Next.js 404 pages",
        "src/app/robots.txt - SEO robots file",
        "src/app/sitemap*.xml - SEO sitemap files",
        "public/manifest.json - PWA manifest",
        "public/sw.js - Service worker",
        "public/icons/* - PWA icons",
        "public/fonts/* - Web fonts",
      ],
      recommendations: [],
    };
  }

  async run(): Promise<void> {
    console.log("🔍 Starting cleanup inventory...\n");

    try {
      await this.analyzeTypeScriptUnused();
      await this.analyzeESLintUnused();
      await this.analyzeUnreferencedFiles();
      await this.analyzeUnusedAssets();
      await this.analyzeUnusedDependencies();
      await this.analyzePlaceholders();

      await this.generateSummary();
      await this.saveReport();

      console.log("\n✅ Inventory complete!");
      this.printSummary();
    } catch (error) {
      console.error("❌ Inventory failed:", error);
      process.exit(1);
    }
  }

  private async analyzeTypeScriptUnused(): Promise<void> {
    console.log("📝 Analyzing TypeScript unused locals and parameters...");

    try {
      execSync("npx tsc --noEmit --noUnusedLocals --noUnusedParameters", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("   ✅ No unused TypeScript locals/parameters found");
    } catch (error: any) {
      const output = error.stdout?.toString() || "";
      const lines = output.split("\n");

      for (const line of lines) {
        if (line.includes("is declared but never used")) {
          const match = line.match(
            /^(.+?)\((\d+),(\d+)\): .+'(.+?)' is declared but never used/,
          );
          if (match) {
            const [, filepath, lineNum, colNum, varName] = match;
            this.report.unused.push({
              type: "variable",
              path: path.relative(this.projectRoot, filepath),
              name: varName,
              line: parseInt(lineNum),
              column: parseInt(colNum),
              reason: "Declared but never used (TypeScript)",
              confidence: "high",
              category: "unused-code",
            });
          }
        }
      }
      console.log(
        `   📊 Found ${this.report.unused.length} unused TypeScript items`,
      );
    }
  }

  private async analyzeESLintUnused(): Promise<void> {
    console.log("🔧 Analyzing ESLint unused variables and imports...");

    try {
      const output = execSync("npx eslint . --format=json --ext .ts,.tsx", {
        cwd: this.projectRoot,
        stdio: "pipe",
      }).toString();

      const results = JSON.parse(output);
      let unusedCount = 0;

      for (const result of results) {
        for (const message of result.messages) {
          if (
            message.ruleId === "@typescript-eslint/no-unused-vars" ||
            message.ruleId === "no-unused-vars"
          ) {
            this.report.unused.push({
              type: "variable",
              path: path.relative(this.projectRoot, result.filePath),
              line: message.line,
              column: message.column,
              reason: message.message,
              confidence: "high",
              category: "unused-code",
            });
            unusedCount++;
          }

          if (message.message.includes("placeholder")) {
            this.report.unused.push({
              type: "placeholder",
              path: path.relative(this.projectRoot, result.filePath),
              line: message.line,
              column: message.column,
              reason: "Placeholder comment detected",
              confidence: "high",
              category: "placeholder-content",
            });
          }
        }
      }

      console.log(
        `   📊 Found ${unusedCount} unused variables/imports via ESLint`,
      );
    } catch (error: any) {
      console.log("   ℹ️  ESLint analysis completed with warnings");
    }
  }

  private async analyzeUnreferencedFiles(): Promise<void> {
    console.log("📁 Analyzing unreferenced files...");

    const sourceFiles = await glob("src/**/*.{ts,tsx,js,jsx}", {
      cwd: this.projectRoot,
      ignore: [
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/**/error.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/not-found.tsx",
        "src/app/robots.txt",
        "src/app/sitemap*.xml",
        "src/app/api/**",
      ],
    });

    this.report.summary.totalFiles = sourceFiles.length;

    const allContent = await Promise.all(
      sourceFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(this.projectRoot, file),
          "utf8",
        );
        return { file, content };
      }),
    );

    let unreferencedCount = 0;

    for (const sourceFile of sourceFiles) {
      const relativePath = sourceFile.replace(/\.(ts|tsx|js|jsx)$/, "");

      // Check if this file is imported anywhere
      let isReferenced = false;

      for (const { content } of allContent) {
        // Check for various import patterns
        const importPatterns = [
          `from '${relativePath}'`,
          `from "${relativePath}"`,
          `from '@/${relativePath.replace("src/", "")}'`,
          `from "@/${relativePath.replace("src/", "")}"`,
          `import('${relativePath}')`,
          `import("${relativePath}")`,
          `import('@/${relativePath.replace("src/", "")}')`,
          `import("@/${relativePath.replace("src/", "")}")`,
        ];

        if (importPatterns.some((pattern) => content.includes(pattern))) {
          isReferenced = true;
          break;
        }
      }

      if (!isReferenced) {
        const stats = await fs.stat(path.join(this.projectRoot, sourceFile));
        this.report.unused.push({
          type: "file",
          path: sourceFile,
          size: stats.size,
          reason: "No import references found",
          confidence: "medium",
          category: "unreferenced-files",
        });
        unreferencedCount++;
      }
    }

    console.log(
      `   📊 Found ${unreferencedCount} potentially unreferenced files`,
    );
  }

  private async analyzeUnusedAssets(): Promise<void> {
    console.log("🖼️  Analyzing unused public assets...");

    const assetFiles = await glob(
      "public/**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,otf,mp3,mp4,webm,glb,gltf}",
      {
        cwd: this.projectRoot,
      },
    );

    this.report.summary.totalAssets = assetFiles.length;

    const sourceFiles = await glob("src/**/*.{ts,tsx,js,jsx,css,scss,sass}", {
      cwd: this.projectRoot,
    });

    const allContent = await Promise.all(
      sourceFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(this.projectRoot, file),
          "utf8",
        );
        return content;
      }),
    );

    const manifestContent = await fs
      .readFile(path.join(this.projectRoot, "public/manifest.json"), "utf8")
      .catch(() => "{}");

    let unusedAssetCount = 0;

    for (const asset of assetFiles) {
      const assetName = path.basename(asset);
      const assetPath = asset.replace("public/", "/");

      let isReferenced = false;

      // Check in all source files and manifest
      const allContentToCheck = [...allContent, manifestContent];

      for (const content of allContentToCheck) {
        if (content.includes(assetName) || content.includes(assetPath)) {
          isReferenced = true;
          break;
        }
      }

      // Skip known PWA assets and fonts (likely used by manifest or CSS)
      const skipPatterns = [
        "/icons/",
        "/fonts/",
        "sw.js",
        "manifest.json",
        "favicon",
        "apple-touch-icon",
        "robots.txt",
      ];

      if (skipPatterns.some((pattern) => asset.includes(pattern))) {
        isReferenced = true;
      }

      if (!isReferenced) {
        const stats = await fs.stat(path.join(this.projectRoot, asset));
        this.report.unused.push({
          type: "asset",
          path: asset,
          size: stats.size,
          reason: "No references found in source code",
          confidence: "medium",
          category: "unused-assets",
        });
        unusedAssetCount++;
      }
    }

    console.log(`   📊 Found ${unusedAssetCount} potentially unused assets`);
  }

  private async analyzeUnusedDependencies(): Promise<void> {
    console.log("📦 Analyzing potentially unused dependencies...");

    const packageJson = JSON.parse(
      await fs.readFile(path.join(this.projectRoot, "package.json"), "utf8"),
    );

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    this.report.summary.totalDependencies = Object.keys(allDeps).length;

    const sourceFiles = await glob("src/**/*.{ts,tsx,js,jsx}", {
      cwd: this.projectRoot,
    });

    const configFiles = await glob("{*.config.*, *.json}", {
      cwd: this.projectRoot,
    });

    const allContent = await Promise.all(
      [...sourceFiles, ...configFiles].map(async (file) => {
        const content = await fs.readFile(
          path.join(this.projectRoot, file),
          "utf8",
        );
        return content;
      }),
    );

    let potentiallyUnusedCount = 0;

    for (const [depName] of Object.entries(allDeps)) {
      // Skip obvious framework dependencies
      const frameworkDeps = [
        "next",
        "react",
        "react-dom",
        "@types/react",
        "@types/node",
        "typescript",
        "eslint",
        "prettier",
      ];

      if (frameworkDeps.includes(depName)) continue;

      let isUsed = false;

      for (const content of allContent) {
        if (
          content.includes(`from '${depName}'`) ||
          content.includes(`from "${depName}"`) ||
          content.includes(`require('${depName}')`) ||
          content.includes(`"${depName}"`)
        ) {
          isUsed = true;
          break;
        }
      }

      if (!isUsed) {
        this.report.unused.push({
          type: "dependency",
          path: "package.json",
          name: depName,
          reason: "No import statements found",
          confidence: "low",
          category: "potentially-unused-deps",
        });
        potentiallyUnusedCount++;
      }
    }

    console.log(
      `   📊 Found ${potentiallyUnusedCount} potentially unused dependencies`,
    );
  }

  private async analyzePlaceholders(): Promise<void> {
    console.log("📝 Analyzing placeholder content...");

    const sourceFiles = await glob("src/**/*.{ts,tsx,js,jsx}", {
      cwd: this.projectRoot,
    });

    let placeholderCount = 0;

    for (const file of sourceFiles) {
      const content = await fs.readFile(
        path.join(this.projectRoot, file),
        "utf8",
      );
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Look for ellipsis characters or placeholder text
        if (
          line.includes("…") ||
          line.includes("placeholder") ||
          line.includes("TODO") ||
          line.includes("FIXME")
        ) {
          this.report.unused.push({
            type: "placeholder",
            path: file,
            line: i + 1,
            reason: "Contains placeholder or TODO content",
            confidence: "high",
            category: "placeholder-content",
          });
          placeholderCount++;
        }
      }
    }

    console.log(`   📊 Found ${placeholderCount} placeholder items`);
  }

  private async generateSummary(): Promise<void> {
    this.report.summary.unusedItems = this.report.unused.length;

    // Calculate estimated savings
    this.report.summary.estimatedSavings.files = this.report.unused.filter(
      (item) => item.type === "file",
    ).length;

    this.report.summary.estimatedSavings.bytes = this.report.unused
      .filter((item) => item.size)
      .reduce((sum, item) => sum + (item.size || 0), 0);

    // Generate recommendations
    this.report.recommendations = [
      "Review medium/low confidence items manually before deletion",
      "Test application thoroughly after removing unused code",
      "Consider dynamic imports that may not be detected by static analysis",
      "Verify API routes and metadata generators are not incorrectly flagged",
      'Check for code generation tools that may reference "unused" files',
      "Review placeholder content for business logic that should be preserved",
    ];
  }

  private async saveReport(): Promise<void> {
    const reportsDir = path.join(this.projectRoot, "reports");
    await fs.mkdir(reportsDir, { recursive: true });

    const reportPath = path.join(reportsDir, "cleanup-inventory.json");
    await fs.writeFile(reportPath, JSON.stringify(this.report, null, 2));

    // Also save a human-readable summary
    const summaryPath = path.join(reportsDir, "cleanup-inventory-summary.md");
    await fs.writeFile(summaryPath, this.generateMarkdownSummary());

    console.log(`\n📋 Report saved to: ${reportPath}`);
    console.log(`📄 Summary saved to: ${summaryPath}`);
  }

  private generateMarkdownSummary(): string {
    const { summary, unused } = this.report;
    const categories = [...new Set(unused.map((item) => item.category))];

    let md = `# Cleanup Inventory Report\n\n`;
    md += `Generated: ${this.report.timestamp}\n\n`;

    md += `## Summary\n\n`;
    md += `- **Total Files Analyzed**: ${summary.totalFiles}\n`;
    md += `- **Total Assets Analyzed**: ${summary.totalAssets}\n`;
    md += `- **Total Dependencies**: ${summary.totalDependencies}\n`;
    md += `- **Unused Items Found**: ${summary.unusedItems}\n`;
    md += `- **Estimated File Savings**: ${summary.estimatedSavings.files} files\n`;
    md += `- **Estimated Size Savings**: ${(summary.estimatedSavings.bytes / 1024).toFixed(1)} KB\n\n`;

    for (const category of categories) {
      const items = unused.filter((item) => item.category === category);
      md += `## ${category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}\n\n`;
      md += `Found ${items.length} items:\n\n`;

      for (const item of items.slice(0, 10)) {
        // Show first 10 per category
        md += `- **${item.path}**`;
        if (item.name) md += ` (${item.name})`;
        if (item.line) md += ` at line ${item.line}`;
        md += `\n  - ${item.reason}\n  - Confidence: ${item.confidence}\n\n`;
      }

      if (items.length > 10) {
        md += `_... and ${items.length - 10} more items_\n\n`;
      }
    }

    md += `## Recommendations\n\n`;
    for (const rec of this.report.recommendations) {
      md += `- ${rec}\n`;
    }

    md += `\n## False Positives (Known Safe Items)\n\n`;
    for (const fp of this.report.falsePositives) {
      md += `- ${fp}\n`;
    }

    return md;
  }

  private printSummary(): void {
    const { summary } = this.report;

    console.log("\n📊 INVENTORY SUMMARY");
    console.log("===================");
    console.log(`Files Analyzed: ${summary.totalFiles}`);
    console.log(`Assets Analyzed: ${summary.totalAssets}`);
    console.log(`Dependencies: ${summary.totalDependencies}`);
    console.log(`Unused Items: ${summary.unusedItems}`);
    console.log(
      `Potential Savings: ${summary.estimatedSavings.files} files, ${(summary.estimatedSavings.bytes / 1024).toFixed(1)} KB`,
    );

    const categories = [
      ...new Set(this.report.unused.map((item) => item.category)),
    ];
    for (const category of categories) {
      const count = this.report.unused.filter(
        (item) => item.category === category,
      ).length;
      console.log(`  - ${category}: ${count} items`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const inventory = new CleanupInventory();
  inventory.run().catch(console.error);
}

export default CleanupInventory;
