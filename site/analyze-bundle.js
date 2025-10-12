#!/usr/bin/env node

// Bundle Analysis Script for ProWeb Studio
// Analyzes Next.js build output to identify optimization opportunities

const fs = require("fs");
const path = require("path");

const CHUNKS_DIR = ".next/static/chunks";
const MANIFEST_PATH = ".next/app-build-manifest.json";

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function analyzeBundle() {
  console.log("🔍 ProWeb Studio Bundle Analysis Report\n");

  // Read manifest to understand page bundles
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

  // Analyze chunks
  const chunks = fs
    .readdirSync(CHUNKS_DIR)
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const filePath = path.join(CHUNKS_DIR, file);
      const size = getFileSize(filePath);
      return { file, size, formattedSize: formatBytes(size) };
    })
    .sort((a, b) => b.size - a.size);

  console.log("📊 Top 10 Largest Chunks:");
  console.log("".padEnd(50, "="));
  chunks.slice(0, 10).forEach((chunk, index) => {
    console.log(
      `${(index + 1).toString().padStart(2)}: ${chunk.file.padEnd(35)} ${chunk.formattedSize.padStart(10)}`,
    );
  });

  console.log("\n📁 Page Bundle Analysis:");
  console.log("".padEnd(50, "="));

  // Calculate page sizes
  Object.entries(manifest.pages).forEach(([page, files]) => {
    const totalSize = files.reduce((acc, file) => {
      if (file.includes("static/chunks/")) {
        const chunkFile = file.replace("static/chunks/", "");
        const chunk = chunks.find((c) => c.file === chunkFile);
        return acc + (chunk ? chunk.size : 0);
      }
      return acc;
    }, 0);

    console.log(`${page.padEnd(25)} ${formatBytes(totalSize).padStart(10)}`);
  });

  // Identify 3D/Three.js related chunks
  console.log("\n🎮 Three.js Related Chunks:");
  console.log("".padEnd(50, "="));

  const threeChunks = chunks.filter(
    (chunk) =>
      chunk.file.includes("three") ||
      chunk.file.includes("664-") || // Known to contain 3D code from manifest
      chunk.file.includes("913-"), // Known to contain 3D code from manifest
  );

  threeChunks.forEach((chunk) => {
    console.log(`${chunk.file.padEnd(35)} ${chunk.formattedSize.padStart(10)}`);
  });

  // Total sizes
  const totalSize = chunks.reduce((acc, chunk) => acc + chunk.size, 0);
  const vendorSize = chunks.find((c) => c.file.includes("vendors"))?.size || 0;
  const threeSize = threeChunks.reduce((acc, chunk) => acc + chunk.size, 0);

  console.log("\n📈 Summary:");
  console.log("".padEnd(50, "="));
  console.log(`Total Bundle Size:        ${formatBytes(totalSize)}`);
  console.log(`Vendor Chunk Size:        ${formatBytes(vendorSize)}`);
  console.log(`Three.js Related Size:    ${formatBytes(threeSize)}`);
  console.log(
    `Three.js % of Total:      ${((threeSize / totalSize) * 100).toFixed(1)}%`,
  );

  return {
    chunks,
    threeChunks,
    totalSize,
    vendorSize,
    threeSize,
    manifest,
  };
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
