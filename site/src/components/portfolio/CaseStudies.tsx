'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';

import { Button } from '@/components/Button';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  technologies: string[];
  duration: string;
  testimonial: {
    text: string;
    author: string;
    position: string;
    company: string;
  };
  image: string;
  link?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'dutch-fashion-brand',
    title: 'E-commerce Platform voor Nederlandse Fashion Brand',
    client: 'Amsterdam Fashion House',
    category: 'E-commerce & Brand Identity',
    description: 'Complete rebranding en e-commerce platform voor een gevestigde Nederlandse fashion brand.',
    challenge: 'Verouderde website met lage conversie, geen mobiele optimalisatie en zwakke brand identity in een competitieve markt.',
    solution: 'Modern 3D e-commerce platform met interactieve product showcase, geoptimaliseerd voor Nederlandse consumers en mobile-first design.',
    results: [
      { metric: 'Conversie Verbetering', value: '+340%', description: 'Van 1.2% naar 5.3% conversie ratio' },
      { metric: 'Mobiel Traffic', value: '+280%', description: 'Significante toename mobile bezoekers' },
      { metric: 'Gemiddelde Bestelling', value: '+67%', description: 'Hogere AOV door betere UX' },
      { metric: 'Pagina Laadtijd', value: '2.1s', description: 'Optimale performance op alle devices' },
    ],
    technologies: ['Next.js', 'Three.js', 'Stripe', 'Sanity CMS', 'Vercel'],
    duration: '8 weken',
    testimonial: {
      text: 'ProWeb Studio heeft onze online presence volledig getransformeerd. De combinatie van prachtig design en technische excellentie heeft onze verkoop meer dan verdrievoudigd.',
      author: 'Sarah van der Berg',
      position: 'Creative Director',
      company: 'Amsterdam Fashion House'
    },
    image: '/assets/portfolio/fashion-brand-case.jpg'
  },
  {
    id: 'tech-startup-platform',
    title: 'SaaS Platform voor Nederlandse Tech Startup',
    client: 'InnovateTech Rotterdam',
    category: 'SaaS Platform & Data Visualization',
    description: 'Complexe data visualisatie platform met real-time analytics voor Nederlandse tech bedrijven.',
    challenge: 'Complexe data moest intuïtief worden gepresenteerd voor niet-technische gebruikers, met real-time updates en multi-tenant architectuur.',
    solution: 'Interactive 3D dashboard met WebGL visualisaties, real-time data streams en gebruiksvriendelijke Nederlandse interface.',
    results: [
      { metric: 'Gebruikers Retentie', value: '+89%', description: 'Verhoogde user engagement' },
      { metric: 'Klanttevredenheid', value: '9.2/10', description: 'Hoge NPS score' },
      { metric: 'Data Processing', value: '99.9%', description: 'Uptime en betrouwbaarheid' },
      { metric: 'Load Time', value: '1.8s', description: 'Snelle data visualisatie' },
    ],
    technologies: ['React', 'Three.js', 'Node.js', 'PostgreSQL', 'WebSockets'],
    duration: '12 weken',
    testimonial: {
      text: 'Hun technische expertise en oog voor detail hebben ons geholpen een platform te bouwen dat onze klanten echt begrijpen en waarderen. Wereldklasse werk.',
      author: 'Mark Hendriks',
      position: 'CTO',
      company: 'InnovateTech Rotterdam'
    },
    image: '/assets/portfolio/saas-platform-case.jpg'
  },
  {
    id: 'restaurant-chain-app',
    title: 'Mobile App voor Nederlandse Restaurant Keten',
    client: 'De Smaak van Nederland',
    category: 'Mobile App & PWA',
    description: 'Progressive Web App met locatie-based services en real-time bestellingen voor restaurant keten.',
    challenge: 'Integratie van 25+ locaties, real-time voorraad tracking, en naadloze mobile ervaring voor Nederlandse foodies.',
    solution: 'PWA met geolocation, push notifications, offline functionaliteit en integration met POS systemen.',
    results: [
      { metric: 'App Adoptie', value: '+156%', description: 'Downloads en actieve gebruikers' },
      { metric: 'Online Bestellingen', value: '+243%', description: 'Toename digital orders' },
      { metric: 'Customer Satisfaction', value: '4.8/5', description: 'App store ratings' },
      { metric: 'Repeat Orders', value: '+78%', description: 'Verhoogde klantloyaliteit' },
    ],
    technologies: ['PWA', 'React Native', 'Firebase', 'Maps API', 'Push Notifications'],
    duration: '10 weken',
    testimonial: {
      text: 'De app heeft onze digitale transformatie mogelijk gemaakt. Klanten vinden ons nu makkelijker en bestellen vaker. Fantastische samenwerking.',
      author: 'Petra Jansen',
      position: 'Operations Manager',
      company: 'De Smaak van Nederland'
    },
    image: '/assets/portfolio/restaurant-app-case.jpg'
  }
];

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState<string>(caseStudies[0].id);

  const currentCase = caseStudies.find(study => study.id === selectedCase) || caseStudies[0];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900">
      <div className="container mx-auto px-safe">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Succesvolle{' '}
            <span className="bg-gradient-to-r from-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
              Case Studies
            </span>
          </h2>
          <p className="text-xl text-cosmic-200 max-w-3xl mx-auto">
            Ontdek hoe wij Nederlandse bedrijven hebben geholpen hun digitale doelen te bereiken 
            met innovatieve oplossingen en meetbare resultaten.
          </p>
        </motion.div>

        {/* Case Study Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {caseStudies.map((study) => (
            <motion.button
              key={study.id}
              onClick={() => setSelectedCase(study.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCase === study.id
                  ? 'bg-gradient-to-r from-stellar-500 to-cosmic-500 text-white shadow-lg shadow-stellar-500/25'
                  : 'bg-cosmic-800/50 text-cosmic-300 hover:bg-cosmic-700/50 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {study.category}
            </motion.button>
          ))}
        </div>

        {/* Case Study Content */}
        <motion.div
          key={selectedCase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Case Study Details */}
          <div>
            <div className="bg-cosmic-800/50 rounded-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-stellar-500/20 text-stellar-400 rounded-full text-sm font-medium">
                  {currentCase.category}
                </span>
                <span className="text-cosmic-400 text-sm">{currentCase.duration}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{currentCase.title}</h3>
              <p className="text-cosmic-200 mb-6">{currentCase.description}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Uitdaging</h4>
                  <p className="text-cosmic-300">{currentCase.challenge}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Oplossing</h4>
                  <p className="text-cosmic-300">{currentCase.solution}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Gebruikte Technologieën</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentCase.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-cosmic-700/50 text-cosmic-300 rounded-lg text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Testimonial */}
            <div className="bg-gradient-to-r from-stellar-900/50 to-cosmic-900/50 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <blockquote className="text-lg text-white mb-4 italic">
                    &ldquo;{currentCase.testimonial.text}&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-stellar-400">{currentCase.testimonial.author}</div>
                    <div className="text-sm text-cosmic-300">
                      {currentCase.testimonial.position} bij {currentCase.testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Metrics */}
          <div>
            <h4 className="text-2xl font-bold text-white mb-8">Behaalde Resultaten</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {currentCase.results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-cosmic-800/50 rounded-lg p-6 text-center"
                >
                  <div className="text-3xl font-bold text-stellar-400 mb-2">{result.value}</div>
                  <div className="text-lg font-semibold text-white mb-2">{result.metric}</div>
                  <div className="text-sm text-cosmic-300">{result.description}</div>
                </motion.div>
              ))}
            </div>

            {/* Project Image Placeholder */}
            <div className="bg-cosmic-800/30 rounded-lg p-8 text-center">
              <div className="w-full h-64 bg-gradient-to-br from-cosmic-700 to-stellar-800 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-cosmic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-cosmic-300 text-sm">Project Screenshots & Demo Video</p>
            </div>

            {/* CTA Button */}
            <div className="mt-8 text-center">
              <Button
                href="/contact"
                variant="primary"
                size="large"
              >
                Start Jullie Succesverhaal
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}