import { Metadata } from 'next';
import { dutchProvinces, generateProvinceMetaTags } from '@/lib/seo-config';
import { notFound } from 'next/navigation';

interface ProvincePageProps {
  params: {
    province: string;
  };
}

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const province = params.province
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
    
  if (!dutchProvinces.includes(province)) {
    return {};
  }
  
  const metaTags = generateProvinceMetaTags(province);
  
  return {
    title: metaTags.title,
    description: metaTags.description,
    keywords: metaTags.keywords,
    openGraph: {
      title: metaTags.title,
      description: metaTags.description,
    },
    other: {
      'geo.region': `NL-${province}`,
      'geo.placename': province,
    },
  };
}

export async function generateStaticParams() {
  return dutchProvinces.map((province) => ({
    province: province.toLowerCase().replace('-', '-'),
  }));
}

export default function ProvincePage({ params }: ProvincePageProps) {
  const province = params.province
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
    
  if (!dutchProvinces.includes(province)) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      <section className="py-20">
        <div className="container">
          <h1 className="text-4xl font-bold mb-6">
            Website Laten Maken in {province}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professionele website laten maken door experts in {province}. 
            Wij leveren maatwerk websites voor bedrijven in heel {province}.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Lokale Expertise</h2>
              <p>Wij kennen de markt in {province} en maken websites die perfect aansluiten bij uw doelgroep.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Snelle Service</h2>
              <p>Persoonlijk contact en snelle oplevering voor ondernemers in {province}.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Scherpe Prijzen</h2>
              <p>Concurrerende tarieven voor website laten maken in {province}. Vraag een offerte aan!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
