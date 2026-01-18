'use client';

/**
 * TechTrustStrip - Shows technology logos to build trust
 * Ethical alternative to testimonials - proves competence through tech stack
 */

const technologies = [
    {
        name: 'Next.js 15',
        description: 'React Framework',
        logo: (
            <svg className="w-8 h-8" viewBox="0 0 180 180" fill="none">
                <mask id="mask0_408_134" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                    <circle cx="90" cy="90" r="90" fill="currentColor" />
                </mask>
                <g mask="url(#mask0_408_134)">
                    <circle cx="90" cy="90" r="90" fill="currentColor" />
                    <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)" />
                    <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)" />
                </g>
                <defs>
                    <linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    },
    {
        name: 'Vercel',
        description: 'Edge Hosting',
        logo: (
            <svg className="w-8 h-8" viewBox="0 0 76 65" fill="currentColor">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
        ),
    },
    {
        name: 'Three.js',
        description: '3D Graphics',
        logo: (
            <svg className="w-8 h-8" viewBox="0 0 640 640" fill="currentColor">
                <path d="M320 32L640 576H0L320 32ZM320 128L128 512H512L320 128Z" fillOpacity="0.3" />
                <path d="M320 96L576 544H64L320 96Z" />
            </svg>
        ),
    },
    {
        name: 'TypeScript',
        description: 'Type Safety',
        logo: (
            <svg className="w-8 h-8" viewBox="0 0 128 128" fill="currentColor">
                <path d="M2 63.91V127.82h126V0H2v63.91zm100.73-5.36v8.68H81.49v42.94H69.93V67.23h-21v-8.68h53.8zm-46.92 18.68c0-5.53.62-9.56 1.84-12.11s3.18-4.47 5.87-5.76c2.69-1.3 6.36-2.31 11.04-3.04 4.67-.73 8.08-1.5 10.2-2.3 2.13-.8 3.2-2.18 3.2-4.14 0-1.78-.75-3.02-2.25-3.73s-3.76-1.06-6.77-1.06c-3.18 0-5.73.44-7.65 1.33s-3.28 2.53-4.08 4.93l-11.65-1.4c.67-3.4 2.05-6.11 4.16-8.15s4.8-3.52 8.1-4.45 7.2-1.4 11.72-1.4c5.64 0 10.43.81 14.36 2.44 3.93 1.62 5.9 5.1 5.9 10.44v25.15c0 2.1.35 3.44 1.05 4.02.7.58 1.68.88 2.93.88.53 0 1.25-.05 2.16-.15v8.68c-1.2.33-2.23.55-3.1.64s-1.87.14-3.01.14c-4.16 0-7.05-1.83-8.65-5.48l-.26-.64c-1.8 2.1-4.23 3.76-7.28 4.99s-6.52 1.84-10.41 1.84c-5.24 0-9.45-1.4-12.61-4.18-3.16-2.79-4.74-6.39-4.74-10.79 0-4.8 1.68-8.44 5.05-10.92s8.46-4.13 15.29-4.96c4.53-.53 7.62-1.14 9.26-1.82 1.64-.68 2.46-1.79 2.46-3.32s-.52-2.66-1.55-3.37c-1.04-.71-2.76-1.06-5.18-1.06-2.8 0-4.93.49-6.4 1.47-1.47.98-2.4 2.61-2.79 4.87l-11.5-1.16z" />
            </svg>
        ),
    },
    {
        name: 'React 19',
        description: 'UI Library',
        logo: (
            <svg className="w-8 h-8" viewBox="0 0 128 128" fill="currentColor">
                <g>
                    <circle cx="64" cy="64" r="11.4" />
                    <path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.7-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.1-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM33.1 14.7c1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6-1.7-10.5-.3-17.9 3.8-20.3zM10.2 64c0-4.8 5.4-10 14.9-13.7 2-1 4.1-1.8 6.4-2.6 1.5 5.1 3.4 10.4 5.8 15.7-2.4 5.3-4.3 10.6-5.8 15.7-2.2-.8-4.4-1.6-6.4-2.6-9.4-3.6-14.9-8.8-14.9-12.5zm22.9 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM91 113.3c-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9 4.1 2.4 5.5 9.8 3.8 20.3zm6.9-16.6c-2 1-4.1 1.8-6.4 2.6-1.5-5.1-3.4-10.4-5.8-15.7 2.4-5.3 4.3-10.6 5.8-15.7 2.2.8 4.4 1.6 6.4 2.6 9.5 3.7 14.9 8.9 14.9 13.7s-5.4 10-14.9 13.5z" />
                </g>
            </svg>
        ),
    },
    {
        name: 'Tailwind',
        description: 'CSS Framework',
        logo: (
            <svg className="w-8 h-8" viewBox="0 0 54 33" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" />
            </svg>
        ),
    },
];

interface TechTrustStripProps {
    className?: string;
}

export default function TechTrustStrip({ className = '' }: TechTrustStripProps) {
    return (
        <section className={`py-12 border-y border-cosmic-700/30 bg-cosmic-900/50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-xs uppercase tracking-wider text-slate-500 mb-8">
                    🛡️ Gebouwd met Enterprise-Grade Technologie
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex items-center gap-3 group"
                        >
                            <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                                {tech.logo}
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-sm font-medium text-white">{tech.name}</div>
                                <div className="text-xs text-slate-500">{tech.description}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs text-slate-600 mt-8">
                    Geen templates. Geen shortcuts. Pure engineering.
                </p>
            </div>
        </section>
    );
}
