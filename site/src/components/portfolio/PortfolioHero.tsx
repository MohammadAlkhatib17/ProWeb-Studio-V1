'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const PortfolioScene = dynamic(() => import('../../three/PortfolioScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900 animate-pulse" />
  ),
});

export default function PortfolioHero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900 animate-pulse" />
        }>
          <PortfolioScene />
        </Suspense>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-safe max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Ons{' '}
            <span className="bg-gradient-to-r from-stellar-400 via-cosmic-400 to-stellar-300 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cosmic-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ontdek onze collectie van innovatieve websites, webshops en mobiele applicaties. 
            Van interactieve 3D ervaringen tot prestatie-geoptimaliseerde e-commerce platforms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a
                href="#showcases"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-stellar-500 to-cosmic-500 hover:from-stellar-400 hover:to-cosmic-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-stellar-500/25"
              >
                Bekijk Onze Werk
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-2 text-cosmic-300"
            >
              <span className="w-2 h-2 bg-stellar-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">50+ Succesvolle Projecten</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-cosmic-300">
            <span className="text-xs font-medium mb-2">Scroll om te ontdekken</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 border-2 border-cosmic-400 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-stellar-400 rounded-full mt-2"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}