"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { CustomContentHero } from "@/components/unified/HeroSection";

const PortfolioScene = dynamic(() => import("../../three/PortfolioScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900 animate-pulse" />
  ),
});

export default function PortfolioHero() {
  return (
    <CustomContentHero
      title="Onze Capaciteiten"
      backgroundContent={
        <Suspense
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900 animate-pulse" />
          }
        >
          <PortfolioScene />
        </Suspense>
      }
      vignette={{ preset: "preserveArtwork" }} // Preserve 3D scene visibility
    >
      {/* Portfolio description with motion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-lg sm:text-xl md:text-2xl text-cosmic-200 max-w-prose mx-auto text-center leading-relaxed">
          Ontdek onze expertise in 3D webontwikkeling, e-commerce platforms en
          brand identity design. Authentieke voorbeelden van cutting-edge
          technologie en Nederlandse vakmanschap.
        </p>
      </motion.div>

      {/* CTA with motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Button
          href="#capabilities"
          variant="primary"
          size="large"
          className="transform hover:scale-105 hover:shadow-lg hover:shadow-stellar-500/25"
        >
          Verken Onze Expertise
          <svg
            className="ml-2 w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Button>
      </motion.div>

      {/* Tech badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex items-center gap-2 text-cosmic-300 justify-center"
      >
        <span className="w-2 h-2 bg-stellar-400 rounded-full animate-pulse"></span>
        <span className="text-xs sm:text-sm font-medium">
          3D • React • Three.js • Nederlandse Kwaliteit
        </span>
      </motion.div>

      {/* Scroll indicator - positioned absolutely within the hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-cosmic-300">
          <span className="text-xs font-medium mb-2 hidden sm:block">
            Scroll om te ontdekken
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 md:w-6 md:h-10 border-2 border-cosmic-400 rounded-full flex justify-center"
          >
            <div className="w-1 h-2 md:h-3 bg-stellar-400 rounded-full mt-1 md:mt-2"></div>
          </motion.div>
        </div>
      </motion.div>
    </CustomContentHero>
  );
}
