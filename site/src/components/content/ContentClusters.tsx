import React from 'react';
import Link from 'next/link';
import { SemanticSection, SemanticHeading } from '../layout/SemanticLayout';
import { CONTENT_CLUSTERS } from '@/config/dutch-seo.config';
import { ContentCluster } from '../seo/DutchKeywordOptimization';
import { Button } from '@/components/Button';

interface ContentClusterHubProps {
  mainCluster: keyof typeof CONTENT_CLUSTERS;
  showRelatedClusters?: boolean;
  className?: string;
}

export function WebsiteLatenMakenCluster({ 
  showRelatedClusters = true, 
  className = '' 
}: Omit<ContentClusterHubProps, 'mainCluster'>) {
  
  const cluster = CONTENT_CLUSTERS['website-laten-maken'];
  
  return (
    <ContentCluster
      mainTopic={cluster.mainTopic}
      supportingTopics={[...cluster.supportingTopics]}
      className={className}
    >
      <SemanticSection as="section" className="py-20 bg-gradient-to-b from-cosmic-900 to-cosmic-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main cluster hub */}
          <header className="text-center mb-16">
            <SemanticHeading 
              level={1} 
              className="text-4xl sm:text-5xl font-bold mb-6"
              keywords={[...cluster.targetKeywords]}
            >
              {cluster.mainTopic} - Complete Gids
              <span className="block text-2xl sm:text-3xl mt-4 text-slate-200">
                Alles wat u moet weten over professionele website ontwikkeling
              </span>
            </SemanticHeading>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Van de eerste ideeën tot een succesvolle online aanwezigheid - ontdek alle aspecten van 
              <strong> website laten maken</strong> in Nederland. Professioneel advies van Nederlandse 
              <strong> webdesign experts</strong>.
            </p>
          </header>

          {/* Supporting topic cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {cluster.supportingTopics.map((topic, index) => {
              const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
              const descriptions = {
                'kosten-website-laten-maken': 'Transparant overzicht van website kosten, prijzen en investeringen voor Nederlandse bedrijven.',
                'website-laten-maken-proces': 'Stap-voor-stap uitleg van ons bewezen ontwikkelproces van concept tot live website.',
                'responsive-website-ontwikkeling': 'Mobiel-vriendelijke websites die perfect werken op alle apparaten en schermformaten.',
                'moderne-website-trends-2025': 'Nieuwste webdesign trends, technologieën en best practices voor moderne websites.',
                'website-onderhoud-en-beheer': 'Doorlopend onderhoud, updates en technische support voor uw website.'
              };
              
              return (
                <article key={index} className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group">
                  <div className="text-3xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {index === 0 ? '💰' : index === 1 ? '⚙️' : index === 2 ? '📱' : index === 3 ? '🚀' : '🔧'}
                  </div>
                  
                  <SemanticHeading level={3} className="text-xl font-bold mb-4 text-cyan-300 group-hover:text-cyan-400 transition-colors duration-300">
                    {topic}
                  </SemanticHeading>
                  
                  <p className="text-slate-300 mb-6 leading-relaxed text-sm">
                    {descriptions[topicSlug as keyof typeof descriptions] || `Ontdek alles over ${topic.toLowerCase()} en hoe dit bijdraagt aan uw online succes.`}
                  </p>
                  
                  <Link 
                    href={`/gids/${topicSlug}`}
                    className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm"
                  >
                    Lees meer over {topic} →
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Quick action section */}
          <div className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 text-center">
            <SemanticHeading level={2} className="text-2xl font-bold mb-4 text-cyan-300">
              Klaar om Uw Website te Laten Maken?
            </SemanticHeading>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Start vandaag nog met uw professionele website project. Onze Nederlandse webdesign experts 
              helpen u van concept tot succesvolle online aanwezigheid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="/contact?service=website-laten-maken"
                variant="primary"
                size="large"
              >
                Gratis Website Advies
              </Button>
              <Button 
                href="/diensten/website-laten-maken"
                variant="secondary"
                size="large"
              >
                Bekijk Onze Diensten
              </Button>
            </div>
          </div>

          {/* Related clusters */}
          {showRelatedClusters && (
            <aside className="mt-20">
              <SemanticHeading level={2} className="text-3xl font-bold text-center mb-12">
                Gerelateerde Onderwerpen
              </SemanticHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Webdesign Nederland cluster */}
                <div className="bg-cosmic-800/20 p-8 rounded-2xl border border-cosmic-700/40">
                  <SemanticHeading level={3} className="text-xl font-bold mb-4 text-cyan-300">
                    Webdesign Nederland
                  </SemanticHeading>
                  <p className="text-slate-300 mb-4 text-sm">
                    Ontdek wat Nederlandse webdesign uniek maakt en waarom lokale expertise belangrijk is.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li>
                      <Link href="/gids/nederlandse-webdesign-trends" className="text-cyan-300 hover:text-cyan-400 text-sm transition-colors duration-200">
                        Nederlandse Webdesign Trends →
                      </Link>
                    </li>
                    <li>
                      <Link href="/gids/lokale-webdesign-expertise" className="text-cyan-300 hover:text-cyan-400 text-sm transition-colors duration-200">
                        Lokale Webdesign Expertise →
                      </Link>
                    </li>
                    <li>
                      <Link href="/gids/webdesign-voor-mkb-bedrijven" className="text-cyan-300 hover:text-cyan-400 text-sm transition-colors duration-200">
                        Webdesign voor MKB Bedrijven →
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Lokale SEO cluster */}
                <div className="bg-cosmic-800/20 p-8 rounded-2xl border border-cosmic-700/40">
                  <SemanticHeading level={3} className="text-xl font-bold mb-4 text-cyan-300">
                    Lokale SEO Nederland
                  </SemanticHeading>
                  <p className="text-slate-300 mb-4 text-sm">
                    Verbeter uw lokale vindbaarheid en trek meer Nederlandse klanten aan.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li>
                      <Link href="/gids/google-my-business-optimalisatie" className="text-cyan-300 hover:text-cyan-400 text-sm transition-colors duration-200">
                        Google My Business Optimalisatie →
                      </Link>
                    </li>
                    <li>
                      <Link href="/gids/lokale-zoekwoorden-onderzoek" className="text-cyan-300 hover:text-cyan-400 text-sm transition-colors duration-200">
                        Lokale Zoekwoorden Onderzoek →
                      </Link>
                    </li>
                    <li>
                      <Link href="/gids/regionale-content-marketing" className="text-cyan-300 hover:text-cyan-400 text-sm transition-colors duration-200">
                        Regionaal Content Marketing →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          )}
        </div>
      </SemanticSection>
    </ContentCluster>
  );
}

// Internal linking component for content clusters
export function ContentClusterNavigation({
  currentTopic,
  currentSlug,
  className = ''
}: {
  currentTopic?: string;
  currentSlug?: string;
  className?: string;
}) {
  
  // Find related content within the same cluster
  const getRelatedContent = () => {
    const clusters = Object.values(CONTENT_CLUSTERS);
    const currentCluster = clusters.find(cluster => 
      cluster.supportingTopics.some(topic => 
        topic.toLowerCase().replace(/\s+/g, '-') === currentSlug ||
        cluster.mainTopic.toLowerCase().replace(/\s+/g, '-') === currentSlug
      ) || cluster.mainTopic === currentTopic
    );
    
    if (!currentCluster) return { relatedTopics: [], clusterLinks: [] };
    
    const relatedTopics = currentCluster.supportingTopics
      .filter(topic => topic.toLowerCase().replace(/\s+/g, '-') !== currentSlug)
      .slice(0, 3);
    
    const clusterLinks = currentCluster.internalLinks.filter(link => 
      !link.includes(currentSlug || '')
    );
    
    return { relatedTopics, clusterLinks, mainTopic: currentCluster.mainTopic };
  };

  const { relatedTopics, clusterLinks, mainTopic } = getRelatedContent();

  if (relatedTopics.length === 0 && clusterLinks.length === 0) {
    return null;
  }

  return (
    <nav 
      className={`content-cluster-navigation ${className}`}
      aria-label="Gerelateerde content navigatie"
    >
      <div className="bg-cosmic-800/20 p-8 rounded-2xl border border-cosmic-700/40">
        <SemanticHeading level={3} className="text-xl font-bold mb-6 text-cyan-300">
          Meer over {mainTopic}
        </SemanticHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Related topics in same cluster */}
          {relatedTopics.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-slate-200">Gerelateerde Onderwerpen</h4>
              <ul className="space-y-3">
                {relatedTopics.map((topic, index) => {
                  const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <li key={index}>
                      <Link 
                        href={`/gids/${topicSlug}`}
                        className="flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                      >
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                        {topic}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {/* Cluster internal links */}
          {clusterLinks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-slate-200">Nuttige Links</h4>
              <ul className="space-y-3">
                {clusterLinks.slice(0, 4).map((link, index) => {
                  const linkTitles = {
                    '/diensten/website-laten-maken': 'Website Laten Maken Service',
                    '/werkwijze': 'Ons Ontwikkelproces',
                    '/portfolio': 'Website Voorbeelden',
                    '/contact': 'Contact & Advies'
                  };
                  
                  return (
                    <li key={index}>
                      <Link 
                        href={link}
                        className="flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                      >
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                        {linkTitles[link as keyof typeof linkTitles] || link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// Breadcrumb navigation for content clusters
export function ContentClusterBreadcrumbs({
  currentTopic,
  mainCluster
}: {
  currentTopic?: string;
  currentSlug?: string;
  mainCluster?: keyof typeof CONTENT_CLUSTERS;
}) {
  
  const cluster = mainCluster ? CONTENT_CLUSTERS[mainCluster] : null;
  
  return (
    <nav aria-label="Content cluster breadcrumbs" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-slate-400">
        <li>
          <Link href="/" className="hover:text-cyan-300 transition-colors duration-200">
            ProWeb Studio
          </Link>
        </li>
        <li className="flex items-center">
          <span className="mx-2">→</span>
          <Link href="/gids" className="hover:text-cyan-300 transition-colors duration-200">
            Website Gids
          </Link>
        </li>
        {cluster && (
          <li className="flex items-center">
            <span className="mx-2">→</span>
            <Link 
              href={`/gids/${cluster.mainTopic.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-cyan-300 transition-colors duration-200"
            >
              {cluster.mainTopic}
            </Link>
          </li>
        )}
        {currentTopic && (
          <li className="flex items-center">
            <span className="mx-2">→</span>
            <span className="text-cyan-300 font-medium">{currentTopic}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}