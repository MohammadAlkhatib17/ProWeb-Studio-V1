import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Metadata } from 'next'
import { generateHreflangLinks, SITE_URL } from '@/utils/urlUtils';

const inter = Inter({ subsets: ['latin'] })
const poppins = localFont({ src: '../public/fonts/Poppins.ttf' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ProWeb Studio - Professionele Websites & Webontwikkeling',
    template: '%s | ProWeb Studio',
  },
  description: 'ProWeb Studio ontwikkelt professionele WordPress websites voor het MKB in Nederland.',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'nl': '/',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    alternateLocale: 'en_US',
    url: SITE_URL,
    siteName: 'ProWeb Studio',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Defer non-critical scripts */}
        <script
          defer
          src="/scripts/analytics.js"
        />
      </body>
    </html>
  )
}