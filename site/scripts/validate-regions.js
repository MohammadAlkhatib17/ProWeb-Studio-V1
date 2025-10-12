#!/usr/bin/env node

/**
 * API Routes Regional Configuration Validator
 * Validates that all API routes have proper runtime and region configuration
 */

const fs = require("fs");
const path = require("path");

const API_DIR = path.join(__dirname, "..", "src", "app", "api");
const EXPECTED_RUNTIME = "nodejs";
const EXPECTED_REGION = "fra1";

function findApiRoutes(dir) {
  const routes = [];

  function scanDirectory(currentDir, relativePath = "") {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const itemRelativePath = path.join(relativePath, item);

      if (fs.statSync(fullPath).isDirectory() && item !== "__tests__") {
        scanDirectory(fullPath, itemRelativePath);
      } else if (item === "route.ts") {
        routes.push({
          path: itemRelativePath,
          fullPath: fullPath,
          routeName: relativePath || "/",
        });
      }
    }
  }

  scanDirectory(dir);
  return routes;
}

function validateRouteConfig(routeFile) {
  const content = fs.readFileSync(routeFile.fullPath, "utf8");

  const runtimeMatch = content.match(
    /export\s+const\s+runtime\s*=\s*['"]([^'"]+)['"]/,
  );
  const regionMatch = content.match(
    /export\s+const\s+preferredRegion\s*=\s*['"]([^'"]+)['"]/,
  );

  return {
    route: routeFile.routeName,
    path: routeFile.path,
    runtime: runtimeMatch ? runtimeMatch[1] : null,
    region: regionMatch ? regionMatch[1] : null,
    hasCorrectRuntime: runtimeMatch && runtimeMatch[1] === EXPECTED_RUNTIME,
    hasCorrectRegion: regionMatch && regionMatch[1] === EXPECTED_REGION,
  };
}

function main() {
  console.log("🔍 Validating API Routes Regional Configuration...\n");

  if (!fs.existsSync(API_DIR)) {
    console.error("❌ API directory not found:", API_DIR);
    process.exit(1);
  }

  const routes = findApiRoutes(API_DIR);

  if (routes.length === 0) {
    console.log("ℹ️  No API routes found");
    return;
  }

  console.log(`📍 Found ${routes.length} API route(s):\n`);

  const results = routes.map(validateRouteConfig);
  let allValid = true;

  // Display results table
  console.log("| Route | Runtime | Region | Status |");
  console.log("|-------|---------|--------|--------|");

  results.forEach((result) => {
    const runtimeIcon = result.hasCorrectRuntime ? "✅" : "❌";
    const regionIcon = result.hasCorrectRegion ? "✅" : "❌";
    const overallStatus =
      result.hasCorrectRuntime && result.hasCorrectRegion
        ? "✅ Valid"
        : "❌ Invalid";

    console.log(
      `| /api${result.route} | ${result.runtime || "missing"} ${runtimeIcon} | ${result.region || "missing"} ${regionIcon} | ${overallStatus} |`,
    );

    if (!result.hasCorrectRuntime || !result.hasCorrectRegion) {
      allValid = false;
    }
  });

  console.log("\n📊 Validation Summary:");
  console.log("─".repeat(50));

  if (allValid) {
    console.log("✅ All API routes are properly configured for EU deployment");
    console.log(`   Runtime: ${EXPECTED_RUNTIME}`);
    console.log(`   Region: ${EXPECTED_REGION} (Frankfurt, Germany)`);
    console.log("   EU Data Locality: ✅ Compliant");
  } else {
    console.log("❌ Some API routes have configuration issues");
    console.log("\nRequired configuration for each route:");
    console.log(`   export const runtime = '${EXPECTED_RUNTIME}';`);
    console.log(`   export const preferredRegion = '${EXPECTED_REGION}';`);
  }

  console.log("\n📋 Configuration Details:");
  console.log(`   Expected Runtime: ${EXPECTED_RUNTIME}`);
  console.log(`   Expected Region: ${EXPECTED_REGION}`);
  console.log("   Purpose: EU GDPR compliance and data locality");
  console.log("   Documentation: reports/ops/regions.md");

  if (!allValid) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateRouteConfig, findApiRoutes };
