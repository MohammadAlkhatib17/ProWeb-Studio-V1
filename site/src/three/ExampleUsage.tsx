// Example usage of Three.js components in a Next.js page
// File: pages/showcase.tsx or app/showcase/page.tsx

import React from 'react'
import { 
  ThreeJSShowcase,
  OptimizedPortfolioComputer,
  OptimizedEcommerceShowcase,
  OptimizedBrandIdentityModel 
} from '@/three'

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Interactive 3D Portfolio
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience our capabilities through immersive 3D visualizations
          </p>
        </div>

        {/* Combined Showcase */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Complete Showcase
          </h2>
          <ThreeJSShowcase 
            components={['portfolio', 'ecommerce', 'brand']}
            layout="stack"
            className="max-w-4xl mx-auto"
          />
        </section>

        {/* Individual Components */}
        <section className="space-y-16">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Portfolio Computer</h2>
            <p className="text-gray-300 mb-6">
              Interactive laptop model showcasing our web development portfolio
            </p>
            <OptimizedPortfolioComputer className="max-w-2xl mx-auto" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">E-commerce Solutions</h2>
            <p className="text-gray-300 mb-6">
              3D visualization of our e-commerce product development capabilities
            </p>
            <OptimizedEcommerceShowcase className="max-w-2xl mx-auto" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Brand Identity</h2>
            <p className="text-gray-300 mb-6">
              Dynamic 3D representation of brand identity and design services
            </p>
            <OptimizedBrandIdentityModel className="max-w-2xl mx-auto" />
          </div>
        </section>

        {/* Grid Layout Example */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Grid Layout
          </h2>
          <ThreeJSShowcase 
            components={['portfolio', 'ecommerce', 'brand']}
            layout="grid"
            className="max-w-6xl mx-auto"
          />
        </section>

      </div>
    </div>
  )
}

// Alternative: Component-specific pages
export function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <OptimizedPortfolioComputer />
      </div>
    </div>
  )
}

export function EcommercePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <OptimizedEcommerceShowcase />
      </div>
    </div>
  )
}

export function BrandPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <OptimizedBrandIdentityModel />
      </div>
    </div>
  )
}