import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateCanonicalUrl, generateHreflangLinks } from '@/utils/urlUtils';

const locales = ['nl', 'en'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isEnglish = locale === 'en';
  
  return {
    title: isEnglish 
      ? 'ProWeb Studio - Professional Websites & Web Development'
      : 'ProWeb Studio - Professionele Websites & Webontwikkeling',
    description: isEnglish
      ? 'ProWeb Studio develops professional WordPress websites for SMEs in the Netherlands.'
      : 'ProWeb Studio ontwikkelt professionele WordPress websites voor het MKB in Nederland.',
    alternates: {
      canonical: generateCanonicalUrl(`${locale === 'nl' ? '' : `/${locale}`}`),
      languages: {
        'nl': '/',
        'en': '/en',
      },
    },
  };
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <div lang={locale}>
      {children}
    </div>
  );
}
