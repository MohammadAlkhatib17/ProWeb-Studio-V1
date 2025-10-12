#!/usr/bin/env node
// scripts/optimize-images.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "../public/assets");
const pngFiles = [
  "glowing_beacon_contact.png",
  "hero_portal_background.png",
  "nebula_services_background.png",
  "team_core_star.png",
];

async function optimizeImage(inputPath, outputBaseName) {
  const inputFile = path.join(assetsDir, inputPath);

  if (!fs.existsSync(inputFile)) {
    console.log(`⚠️  File not found: ${inputFile}`);
    return;
  }

  const outputDir = path.dirname(path.join(assetsDir, inputPath));
  const outputName = path.parse(inputPath).name;

  try {
    // Generate AVIF version (near-lossless, quality 90)
    const avifPath = path.join(outputDir, `${outputName}.avif`);
    await sharp(inputFile)
      .avif({
        quality: 90,
        lossless: false,
        effort: 6, // Maximum compression effort
      })
      .toFile(avifPath);

    // Generate WebP version (near-lossless, quality 90)
    const webpPath = path.join(outputDir, `${outputName}.webp`);
    await sharp(inputFile)
      .webp({
        quality: 90,
        lossless: false,
        effort: 6, // Maximum compression effort
      })
      .toFile(webpPath);

    // Get file sizes for comparison
    const originalStats = fs.statSync(inputFile);
    const avifStats = fs.statSync(avifPath);
    const webpStats = fs.statSync(webpPath);

    const originalSize = (originalStats.size / 1024).toFixed(1);
    const avifSize = (avifStats.size / 1024).toFixed(1);
    const webpSize = (webpStats.size / 1024).toFixed(1);

    const avifSavings = (
      (1 - avifStats.size / originalStats.size) *
      100
    ).toFixed(1);
    const webpSavings = (
      (1 - webpStats.size / originalStats.size) *
      100
    ).toFixed(1);

    console.log(`✅ Optimized: ${inputPath}`);
    console.log(`   Original: ${originalSize}KB`);
    console.log(`   AVIF: ${avifSize}KB (${avifSavings}% smaller)`);
    console.log(`   WebP: ${webpSize}KB (${webpSavings}% smaller)`);
    console.log("");
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");

  for (const file of pngFiles) {
    await optimizeImage(file, path.parse(file).name);
  }

  console.log("✨ Image optimization complete!");
  console.log("\nNote: Original PNG files are preserved as fallbacks.");
}

main().catch(console.error);
