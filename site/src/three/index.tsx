'use client'

import React from 'react'
import PortfolioComputer from './PortfolioComputer'
import EcommerceShowcase from './EcommerceShowcase'
import BrandIdentityModel from './BrandIdentityModel'

// Enhanced components with performance optimizations
export { PerformanceCanvas, useLOD, OptimizedMaterial, useOptimizedAssets } from './PerformanceOptimizations'

interface OptimizedPortfolioComputerProps {
  className?: string
}

export function OptimizedPortfolioComputer({ className }: OptimizedPortfolioComputerProps) {
  return (
    <div className={`w-full h-96 ${className || ''}`}>
      {/* SEO Content */}
      <div className="sr-only">
        <h3>Interactive 3D Portfolio Showcase</h3>
        <p>Explore our web development portfolio in an immersive 3D laptop visualization. 
           Features responsive design, modern animations, and interactive elements.</p>
        <ul>
          <li>Custom 3D laptop model with realistic materials</li>
          <li>Smooth animations and auto-rotation</li>
          <li>Optimized for all device types</li>
          <li>Accessible fallback content</li>
        </ul>
      </div>
      <PortfolioComputer className={className} />
    </div>
  )
}

interface OptimizedEcommerceShowcaseProps {
  className?: string
}

export function OptimizedEcommerceShowcase({ className }: OptimizedEcommerceShowcaseProps) {
  return (
    <div className={`w-full h-96 ${className || ''}`}>
      {/* SEO Content */}
      <div className="sr-only">
        <h3>3D E-commerce Product Visualization</h3>
        <p>Interactive 3D showcase of e-commerce solutions including mobile apps, 
           wearable technology, and audio products with realistic 3D models.</p>
        <ul>
          <li>Mobile application development and design</li>
          <li>Wearable technology integration</li>
          <li>Premium audio product development</li>
          <li>Interactive product visualization</li>
        </ul>
      </div>
      <EcommerceShowcase className={className} />
    </div>
  )
}

interface OptimizedBrandIdentityModelProps {
  className?: string
}

export function OptimizedBrandIdentityModel({ className }: OptimizedBrandIdentityModelProps) {
  return (
    <div className={`w-full h-96 ${className || ''}`}>
      {/* SEO Content */}
      <div className="sr-only">
        <h3>3D Brand Identity and Logo Design</h3>
        <p>Dynamic 3D visualization of brand identity elements including logo design, 
           visual identity systems, and brand guidelines development.</p>
        <ul>
          <li>Custom logo design and development</li>
          <li>Complete brand identity packages</li>
          <li>Visual identity system creation</li>
          <li>3D brand visualization and presentation</li>
        </ul>
      </div>
      <BrandIdentityModel className={className} />
    </div>
  )
}

// Main export of all components
export {
  PortfolioComputer,
  EcommerceShowcase,
  BrandIdentityModel
}

// Combined showcase component
interface ThreeJSShowcaseProps {
  components?: ('portfolio' | 'ecommerce' | 'brand')[]
  layout?: 'stack' | 'grid'
  className?: string
}

export function ThreeJSShowcase({ 
  components = ['portfolio', 'ecommerce', 'brand'],
  layout = 'stack',
  className = ''
}: ThreeJSShowcaseProps) {
  const componentMap = {
    portfolio: OptimizedPortfolioComputer,
    ecommerce: OptimizedEcommerceShowcase,
    brand: OptimizedBrandIdentityModel
  }

  const layoutClass = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
    : 'space-y-8'

  return (
    <section className={`${layoutClass} ${className}`}>
      {/* SEO Structure */}
      <div className="sr-only">
        <h2>Interactive 3D Portfolio Showcase</h2>
        <p>Discover our capabilities through immersive 3D visualizations showcasing 
           web development, e-commerce solutions, and brand identity design.</p>
      </div>
      
      {components.map((componentType) => {
        const Component = componentMap[componentType]
        return (
          <div key={componentType} className="w-full">
            <Component />
          </div>
        )
      })}
    </section>
  )
}

export default ThreeJSShowcase