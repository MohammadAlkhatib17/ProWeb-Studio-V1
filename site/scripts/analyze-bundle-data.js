#!/usr/bin/env node

/**
 * Bundle Analysis Data Generator
 * Generates structured JSON data from Next.js bundle analysis for CI comparison
 */

const fs = require('fs');
const path = require('path');

const NEXT_BUILD_DIR = path.join(process.cwd(), '.next');
const OUTPUT_DIR = path.join(process.cwd(), '..', 'reports', 'bundles');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'analysis-data.json');

function getBundleStats() {
  const statsPath = path.join(NEXT_BUILD_DIR, 'server', 'bundle-analyzer', 'client.json');
  
  if (!fs.existsSync(statsPath)) {
    console.error('Bundle analyzer stats not found. Make sure to run build with ANALYZE=true');
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
}

function getChunkFiles() {
  const chunksDir = path.join(NEXT_BUILD_DIR, 'static', 'chunks');
  
  if (!fs.existsSync(chunksDir)) {
    console.warn('Chunks directory not found');
    return [];
  }

  const files = [];
  
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath, itemRelativePath);
      } else if (item.endsWith('.js')) {
        const stats = fs.statSync(fullPath);
        files.push({
          filename: item,
          path: itemRelativePath,
          sizeBytes: stats.size
        });
      }
    }
  }
  
  scanDirectory(chunksDir);
  return files;
}

function categorizeChunk(filename) {
  if (filename.includes('polyfills')) return 'polyfills';
  if (filename.includes('vendors') || filename.includes('framework')) return 'vendors';
  if (filename.includes('three') || filename.startsWith('three.')) return 'three-core';
  if (filename.match(/^\d+(-|\.)/)) return 'three-components'; // Numbered chunks are typically component splits
  if (filename.includes('main') || filename.includes('app')) return 'app';
  return 'other';
}

function getChunkDescription(filename, category) {
  const descriptions = {
    'polyfills': 'Browser compatibility polyfills',
    'vendors': 'Core vendor libraries (React, Next.js, Framer Motion, etc.)',
    'three-core': 'Three.js core library',
    'three-components': 'Three.js components and route-specific code',
    'app': 'Application-specific code',
    'other': 'Miscellaneous chunks'
  };

  // More specific descriptions for known chunks
  if (filename.includes('three.') && category === 'three-core') {
    return 'Three.js core library';
  }
  if (filename.match(/^913/) && category === 'three-components') {
    return '3D components for diensten, over-ons, werkwijze routes';
  }
  if (filename.match(/^664/) && category === 'three-components') {
    return '3D components for homepage route';
  }

  return descriptions[category] || descriptions['other'];
}

function generateAnalysisData() {
  console.log('🔍 Generating bundle analysis data...');

  // Get bundle files
  const chunkFiles = getChunkFiles();
  
  // Sort by size and take top chunks
  const topChunks = chunkFiles
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 10) // Top 10 chunks
    .map((chunk, index) => {
      const category = categorizeChunk(chunk.filename);
      return {
        rank: index + 1,
        filename: chunk.filename,
        sizeBytes: chunk.sizeBytes,
        sizeFormatted: formatBytes(chunk.sizeBytes),
        category,
        description: getChunkDescription(chunk.filename, category)
      };
    });

  // Calculate total size
  const totalBundleSize = chunkFiles.reduce((total, chunk) => total + chunk.sizeBytes, 0);

  // Get package.json for version info
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

  const analysisData = {
    analysisMetadata: {
      generatedDate: new Date().toISOString().split('T')[0],
      nextJsVersion: packageJson.dependencies.next?.replace('^', '') || 'unknown',
      bundleAnalyzerVersion: packageJson.devDependencies['@next/bundle-analyzer']?.replace('^', '') || 'unknown',
      targetRoutes: ['/', '/diensten'], // Critical routes to monitor
      totalBundleSize: formatBytes(totalBundleSize),
      totalBundleSizeBytes: totalBundleSize
    },
    topChunks,
    allChunks: chunkFiles.map(chunk => ({
      filename: chunk.filename,
      sizeBytes: chunk.sizeBytes,
      category: categorizeChunk(chunk.filename)
    }))
  };

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write analysis data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(analysisData, null, 2));
  
  console.log(`✅ Bundle analysis data generated: ${OUTPUT_FILE}`);
  console.log(`📊 Total bundle size: ${formatBytes(totalBundleSize)}`);
  console.log(`📦 Top chunks analyzed: ${topChunks.length}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

if (require.main === module) {
  generateAnalysisData();
}

module.exports = { generateAnalysisData };