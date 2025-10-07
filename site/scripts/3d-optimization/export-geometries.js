#!/usr/bin/env node

/**
 * Three.js Geometry Exporter to GLTF
 * 
 * Exports procedural Three.js geometries to GLTF format
 * so they can be compressed with Meshopt and KTX2 textures
 */

const THREE = require('three');
const { GLTFExporter } = require('three/addons/exporters/GLTFExporter.js');
const fs = require('fs').promises;
const path = require('path');

class GeometryExporter {
  constructor(options = {}) {
    this.options = {
      binary: true,
      includeCustomExtensions: false,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      animations: [],
      ...options
    };
    
    this.exporter = new GLTFExporter();
  }

  /**
   * Create optimized geometric primitives similar to current site
   */
  createGeometries() {
    const geometries = {};

    // 1. Hexagonal Prism (from HexagonalPrism component)
    geometries.hexagonalPrism = this.createHexagonalPrism();
    
    // 2. Helix/Torus Knot (from HelixKnot component)
    geometries.helixKnot = this.createHelixKnot();
    
    // 3. Polyhedra Set (from ServicesPolyhedra)
    geometries.polyhedra = this.createPolyhedraSet();
    
    // 4. Brand Identity Elements (from BrandIdentityModel)
    geometries.brandElements = this.createBrandElements();
    
    // 5. Flowing Ribbons (from FlowingRibbons)
    geometries.ribbons = this.createFlowingRibbons();

    return geometries;
  }

  /**
   * Create hexagonal prism geometry
   */
  createHexagonalPrism() {
    const scene = new THREE.Scene();
    
    // Create hexagonal shape
    const hexShape = new THREE.Shape();
    const radius = 1;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        hexShape.moveTo(x, y);
      } else {
        hexShape.lineTo(x, y);
      }
    }
    hexShape.closePath();

    // Extrude to create prism
    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00ffff,
      metalness: 0.7,
      roughness: 0.3
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return scene;
  }

  /**
   * Create helix knot geometry
   */
  createHelixKnot() {
    const scene = new THREE.Scene();
    
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      metalness: 0.8,
      roughness: 0.2
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return scene;
  }

  /**
   * Create polyhedra set
   */
  createPolyhedraSet() {
    const scene = new THREE.Scene();
    
    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(0.8);
    const octaMaterial = new THREE.MeshStandardMaterial({
      color: 0x4ecdc4,
      metalness: 0.6,
      roughness: 0.4
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(-2, 0, 0);
    scene.add(octahedron);
    
    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(0.8);
    const dodecaMaterial = new THREE.MeshStandardMaterial({
      color: 0x45b7d1,
      metalness: 0.7,
      roughness: 0.3
    });
    const dodecahedron = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodecahedron.position.set(0, 0, 0);
    scene.add(dodecahedron);
    
    // Tetrahedron
    const tetraGeometry = new THREE.TetrahedronGeometry(0.8);
    const tetraMaterial = new THREE.MeshStandardMaterial({
      color: 0x96ceb4,
      metalness: 0.5,
      roughness: 0.5
    });
    const tetrahedron = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetrahedron.position.set(2, 0, 0);
    scene.add(tetrahedron);
    
    return scene;
  }

  /**
   * Create brand identity elements
   */
  createBrandElements() {
    const scene = new THREE.Scene();
    
    // Main sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      metalness: 0.8,
      roughness: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Orbiting torus
    const torusGeometry = new THREE.TorusGeometry(0.6, 0.2, 8, 20);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xe74c3c,
      metalness: 0.6,
      roughness: 0.4
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(1.5, 0, 0);
    scene.add(torus);
    
    // Rounded box
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0x2ecc71,
      metalness: 0.7,
      roughness: 0.3
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-1.5, 0, 0);
    scene.add(box);
    
    return scene;
  }

  /**
   * Create flowing ribbons geometry
   */
  createFlowingRibbons() {
    const scene = new THREE.Scene();
    
    // Create curved ribbon using TubeGeometry
    class RibbonCurve extends THREE.Curve {
      constructor(scale = 1) {
        super();
        this.scale = scale;
      }
      
      getPoint(t, optionalTarget = new THREE.Vector3()) {
        const tx = Math.sin(2 * Math.PI * t);
        const ty = Math.sin(4 * Math.PI * t) * 0.5;
        const tz = Math.cos(2 * Math.PI * t) * 0.5;
        
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
      }
    }
    
    const curve = new RibbonCurve(2);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
    const material = new THREE.MeshStandardMaterial({
      color: 0x9b59b6,
      metalness: 0.5,
      roughness: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    const ribbon = new THREE.Mesh(geometry, material);
    scene.add(ribbon);
    
    return scene;
  }

  /**
   * Export geometry to GLTF file
   */
  async exportToGLTF(scene, outputPath) {
    return new Promise((resolve, reject) => {
      this.exporter.parse(
        scene,
        async (result) => {
          try {
            if (this.options.binary) {
              await fs.writeFile(outputPath, Buffer.from(result));
            } else {
              await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
            }
            resolve(outputPath);
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(error),
        this.options
      );
    });
  }

  /**
   * Export all geometries
   */
  async exportAll(outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    
    const geometries = this.createGeometries();
    const results = [];
    
    console.log('🔄 Exporting procedural geometries to GLTF...');
    
    for (const [name, scene] of Object.entries(geometries)) {
      const filename = `${name}.${this.options.binary ? 'glb' : 'gltf'}`;
      const outputPath = path.join(outputDir, filename);
      
      try {
        await this.exportToGLTF(scene, outputPath);
        
        const stats = await fs.stat(outputPath);
        results.push({
          name,
          path: outputPath,
          size: stats.size
        });
        
        console.log(`✅ Exported: ${filename} (${this.formatBytes(stats.size)})`);
      } catch (error) {
        console.error(`❌ Failed to export ${name}:`, error.message);
      }
    }
    
    return results;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log(`
Usage: node export-geometries.js <output-dir> [options]

Options:
  --format=gltf       Export as GLTF (text) instead of GLB (binary)
  --include-animations Include animations in export
  --verbose           Enable verbose output

Examples:
  node export-geometries.js ./public/assets/models
  node export-geometries.js ./models --format=gltf --verbose
    `);
    process.exit(1);
  }

  const [outputDir] = args;
  
  const options = {
    binary: !args.includes('--format=gltf'),
    animations: args.includes('--include-animations') ? [] : undefined,
    verbose: args.includes('--verbose')
  };

  const exporter = new GeometryExporter(options);
  
  try {
    const results = await exporter.exportAll(outputDir);
    
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    
    console.log('\n📊 Export Summary:');
    console.log('==================');
    console.log(`Files exported: ${results.length}`);
    console.log(`Total size: ${exporter.formatBytes(totalSize)}`);
    console.log(`Output directory: ${outputDir}`);
    
    if (options.verbose) {
      console.log('\n📋 File Details:');
      results.forEach(r => {
        console.log(`  ${r.name}: ${exporter.formatBytes(r.size)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { GeometryExporter };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}