#!/usr/bin/env node

/**
 * Bundle Size Comparison Script
 * Compares bundle sizes between current and base branch to detect regressions
 */

const fs = require("fs");
const path = require("path");

const THRESHOLD_PERCENT = parseInt(process.env.BUNDLE_SIZE_THRESHOLD || "10");

function loadBundleData(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(
      `Failed to load bundle data from ${filePath}:`,
      error.message,
    );
    process.exit(1);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function calculatePercentageChange(oldSize, newSize) {
  if (oldSize === 0) return newSize > 0 ? 100 : 0;
  return ((newSize - oldSize) / oldSize) * 100;
}

function analyzeChunkChanges(currentData, baseData) {
  const changes = [];
  const currentChunks = new Map();
  const baseChunks = new Map();

  // Index chunks by filename for comparison
  currentData.topChunks?.forEach((chunk) => {
    currentChunks.set(chunk.filename, chunk);
  });

  baseData.topChunks?.forEach((chunk) => {
    baseChunks.set(chunk.filename, chunk);
  });

  // Check for changes in existing chunks
  for (const [filename, currentChunk] of currentChunks) {
    const baseChunk = baseChunks.get(filename);

    if (baseChunk) {
      const percentChange = calculatePercentageChange(
        baseChunk.sizeBytes,
        currentChunk.sizeBytes,
      );

      if (Math.abs(percentChange) > 1) {
        // Only report changes > 1%
        changes.push({
          filename,
          category: currentChunk.category,
          oldSize: baseChunk.sizeBytes,
          newSize: currentChunk.sizeBytes,
          percentChange,
          isRegression: percentChange > THRESHOLD_PERCENT,
        });
      }
    } else {
      // New chunk
      changes.push({
        filename,
        category: currentChunk.category,
        oldSize: 0,
        newSize: currentChunk.sizeBytes,
        percentChange: 100,
        isNew: true,
        isRegression: currentChunk.sizeBytes > 100000, // Flag large new chunks
      });
    }
  }

  // Check for removed chunks
  for (const [filename, baseChunk] of baseChunks) {
    if (!currentChunks.has(filename)) {
      changes.push({
        filename,
        category: baseChunk.category,
        oldSize: baseChunk.sizeBytes,
        newSize: 0,
        percentChange: -100,
        isRemoved: true,
      });
    }
  }

  return changes;
}

function checkCriticalRoutes(currentData, baseData) {
  const criticalRoutes = ["/", "/diensten"]; // Define critical routes
  const routeChanges = [];

  // This is a simplified check - in a real implementation you'd want to
  // track route-specific bundle sizes more precisely
  const currentTotal = currentData.analysisMetadata?.totalBundleSizeBytes || 0;
  const baseTotal = baseData.analysisMetadata?.totalBundleSizeBytes || 0;

  const totalPercentChange = calculatePercentageChange(baseTotal, currentTotal);

  if (Math.abs(totalPercentChange) > 1) {
    routeChanges.push({
      route: "Total Bundle",
      oldSize: baseTotal,
      newSize: currentTotal,
      percentChange: totalPercentChange,
      isRegression: totalPercentChange > THRESHOLD_PERCENT,
    });
  }

  return routeChanges;
}

function main() {
  const [currentFile, baseFile] = process.argv.slice(2);

  if (!currentFile || !baseFile) {
    console.error(
      "Usage: node bundle-compare.js <current-bundle.json> <base-bundle.json>",
    );
    process.exit(1);
  }

  console.log("🔍 Comparing bundle sizes...");
  console.log(`Current: ${currentFile}`);
  console.log(`Base: ${baseFile}`);
  console.log(`Threshold: ${THRESHOLD_PERCENT}%\n`);

  const currentData = loadBundleData(currentFile);
  const baseData = loadBundleData(baseFile);

  // Analyze chunk-level changes
  const chunkChanges = analyzeChunkChanges(currentData, baseData);

  // Check critical routes
  const routeChanges = checkCriticalRoutes(currentData, baseData);

  let hasRegressions = false;
  let hasWarnings = false;

  // Report chunk changes
  if (chunkChanges.length > 0) {
    console.log("📦 Chunk Size Changes:");
    console.log("─".repeat(80));

    chunkChanges.forEach((change) => {
      const icon = change.isRegression
        ? "❌"
        : change.percentChange > 5
          ? "⚠️"
          : "✅";
      const status = change.isNew
        ? "NEW"
        : change.isRemoved
          ? "REMOVED"
          : "CHANGED";

      console.log(`${icon} ${change.filename} (${change.category})`);
      console.log(
        `   ${status}: ${formatBytes(change.oldSize)} → ${formatBytes(change.newSize)}`,
      );
      console.log(
        `   Change: ${change.percentChange > 0 ? "+" : ""}${change.percentChange.toFixed(2)}%`,
      );

      if (change.isRegression) {
        hasRegressions = true;
      } else if (change.percentChange > 5) {
        hasWarnings = true;
      }

      console.log("");
    });
  }

  // Report route changes
  if (routeChanges.length > 0) {
    console.log("🛣️  Critical Route Changes:");
    console.log("─".repeat(80));

    routeChanges.forEach((change) => {
      const icon = change.isRegression
        ? "❌"
        : change.percentChange > 5
          ? "⚠️"
          : "✅";

      console.log(`${icon} ${change.route}`);
      console.log(
        `   Size: ${formatBytes(change.oldSize)} → ${formatBytes(change.newSize)}`,
      );
      console.log(
        `   Change: ${change.percentChange > 0 ? "+" : ""}${change.percentChange.toFixed(2)}%`,
      );

      if (change.isRegression) {
        hasRegressions = true;
      } else if (change.percentChange > 5) {
        hasWarnings = true;
      }

      console.log("");
    });
  }

  // Summary
  console.log("📊 Summary:");
  console.log("─".repeat(80));

  if (hasRegressions) {
    console.log("❌ BUNDLE SIZE REGRESSION DETECTED!");
    console.log(
      `   One or more bundles increased by more than ${THRESHOLD_PERCENT}%`,
    );
    console.log(
      '   This will block the merge unless overridden with "bundle-size-override" label.',
    );
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠️  Bundle size changes detected (within threshold)");
    console.log("   Review the changes above to ensure they are expected.");
  } else if (chunkChanges.length === 0 && routeChanges.length === 0) {
    console.log("✅ No significant bundle size changes detected.");
  } else {
    console.log("✅ All bundle size changes are within acceptable thresholds.");
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeChunkChanges,
  checkCriticalRoutes,
  calculatePercentageChange,
};
