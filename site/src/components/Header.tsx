"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site.config";
import Logo from "@/components/Logo";
import { Button } from "@/components/Button";

const MobileMenu = dynamic(() => import("@/components/navigation/MobileMenu"), {
  ssr: false,
  loading: () => null,
});

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = siteConfig.navigation.map((item) => ({
    href: item.href,
    label: item.name,
  }));

  useEffect(() => {
    // Throttle scroll handler to reduce INP impact
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 bg-transparent ${
        isScrolled
          ? "glass h-16 backdrop-blur-xl border-b border-cosmic-700/30"
          : "h-20"
      }`}
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <div className="relative h-full w-full flex items-center justify-between px-safe">
        {/* Logo positioned at far left */}
        <div
          className="absolute left-0 h-full flex items-center md:pl-6"
          style={{ paddingInlineStart: "env(safe-area-inset-left)" }}
        >
          <Link
            href="/"
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded-lg p-2 -ml-2 md:ml-0 h-full inline-flex items-center"
            aria-label="ProWeb Studio Homepage"
          >
            <Logo
              variant="full"
              size={isScrolled ? "sm" : "md"}
              withGlow={true}
              className="transition-all duration-300 md:block hidden"
            />
            <Logo
              variant="full"
              size="md"
              withGlow={true}
              className="transition-all duration-300 md:hidden block"
            />
          </Link>
        </div>

        {/* Desktop Navigation - centered */}
        <nav
          className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2"
          aria-label="Primary navigation"
        >
          {siteConfig.navigation.map((item) => {
            const isActive = pathname === item.href;
            const isContactLink = item.href === "/contact";

            if (isContactLink) {
              return (
                <Button
                  key={item.href}
                  href={item.href}
                  variant="secondary"
                  size="normal"
                  className="font-medium"
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-all duration-300 relative group py-3 px-3 rounded-lg hover:bg-cyan-400/5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900 min-h-[44px] inline-flex items-center ${
                  isActive ? "text-white" : "text-slate-200 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative z-10">{item.name}</span>
                <div
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-magenta-400 transform transition-transform duration-300 origin-left ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 rounded-lg transition-opacity duration-300 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button - positioned at far right */}
        <div
          className="absolute right-0 h-full flex items-center md:pr-6 md:hidden"
          style={{ paddingInlineEnd: "env(safe-area-inset-right)" }}
        >
          <Button
            as="button"
            variant="secondary"
            size="normal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-2 p-4 -mr-4 md:mr-0 min-h-[56px] min-w-[56px] items-center justify-center !bg-transparent hover:!bg-cosmic-800/50 !border-transparent"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div
              className={`w-8 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`}
            />
            <div
              className={`w-8 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            />
            <div
              className={`w-8 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div id="mobile-menu" className="md:hidden">
        <MobileMenu
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          items={menuItems}
        />
      </div>
    </header>
  );
}
