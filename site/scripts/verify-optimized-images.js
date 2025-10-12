#!/usr/bin/env node
// scripts/verify-optimized-images.js
const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "../public/assets");
const baseImages = [
  "glowing_beacon_contact",
  "hero_portal_background",
  "nebula_services_background",
  "team_core_star",
];

console.log("🔍 Verifying optimized image files...\n");

let allFilesExist = true;
const results = [];

for (const baseName of baseImages) {
  const files = {
    png: path.join(assetsDir, `${baseName}.png`),
    webp: path.join(assetsDir, `${baseName}.webp`),
    avif: path.join(assetsDir, `${baseName}.avif`),
  };

  const fileStats = {};
  let hasAllFormats = true;

  for (const [format, filePath] of Object.entries(files)) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      fileStats[format] = {
        exists: true,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(1),
      };
    } else {
      fileStats[format] = { exists: false };
      hasAllFormats = false;
      allFilesExist = false;
    }
  }

  results.push({
    baseName,
    hasAllFormats,
    files: fileStats,
  });

  // Display results for this image
  console.log(`📸 ${baseName}:`);
  for (const [format, stats] of Object.entries(fileStats)) {
    if (stats.exists) {
      const savings =
        format !== "png" && fileStats.png?.exists
          ? ` (${((1 - stats.size / fileStats.png.size) * 100).toFixed(1)}% smaller)`
          : "";
      console.log(`   ✅ ${format.toUpperCase()}: ${stats.sizeKB}KB${savings}`);
    } else {
      console.log(`   ❌ ${format.toUpperCase()}: Missing`);
    }
  }
  console.log("");
}

// Summary
console.log("📊 Summary:");
console.log(
  `   Images with all formats: ${results.filter((r) => r.hasAllFormats).length}/${results.length}`,
);

if (allFilesExist) {
  console.log("✅ All optimized image files exist and ready for use!");

  // Calculate total savings
  const totalOriginal = results.reduce(
    (sum, r) => sum + (r.files.png?.size || 0),
    0,
  );
  const totalAvif = results.reduce(
    (sum, r) => sum + (r.files.avif?.size || 0),
    0,
  );
  const totalWebp = results.reduce(
    (sum, r) => sum + (r.files.webp?.size || 0),
    0,
  );

  const avifSavings = ((1 - totalAvif / totalOriginal) * 100).toFixed(1);
  const webpSavings = ((1 - totalWebp / totalOriginal) * 100).toFixed(1);

  console.log(`\n💡 Total size comparison:`);
  console.log(`   Original PNG: ${(totalOriginal / 1024).toFixed(1)}KB`);
  console.log(
    `   All AVIF: ${(totalAvif / 1024).toFixed(1)}KB (${avifSavings}% smaller)`,
  );
  console.log(
    `   All WebP: ${(totalWebp / 1024).toFixed(1)}KB (${webpSavings}% smaller)`,
  );
} else {
  console.log(
    "❌ Some optimized files are missing. Please run the optimization script.",
  );
  process.exit(1);
}
