
import Link from 'next/link';

import { Code2, Terminal } from 'lucide-react';
import { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllArticles } from '@/lib/mdx';

export const metadata: Metadata = {
    title: 'Engineering Hub | ProWeb Studio Tech Blog',
    description: 'Diepgaande analyses van WebGL, React Performance en Next.js architectuur. Lees hoe wij de snelste 3D-websites bouwen in Nederland.',
};

export default function EngineeringIndex() {
    const articles = getAllArticles();

    return (
        <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Breadcrumbs items={[{ title: 'Startpagina', href: '/' }, { title: 'Engineering', href: '/engineering' }]} />

                <div className="mb-16 mt-8 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-sm font-mono mb-6">
                        <Terminal className="w-4 h-4" />
                        <span>ENGINEERING_HUB_V1.0</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Onder de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">Motorkap</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        Wij gebruiken niet alleen tools; wij smeden ze. Ontdek onze technische deep-dives in 3D-rendering, performance optimalisatie en schaalbare systeemarchitectuur.
                    </p>
                </div>

                <div className="grid gap-8">
                    {articles.map((article) => (
                        <article key={article.slug} className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div className="space-y-4">
                                    <div className="flex gap-2 text-xs font-mono text-cyan-500 uppercase tracking-widest">
                                        <span>{article.publishedAt}</span>
                                        <span>{'//'}</span>
                                        <span>{article.author}</span>
                                    </div>
                                    <Link href={`/engineering/${article.slug}`}>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {article.title}
                                        </h2>
                                    </Link>
                                    <p className="text-slate-400 max-w-2xl leading-relaxed">
                                        {article.description}
                                    </p>
                                    <div className="flex gap-2 mt-4">
                                        {article.tags?.map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded bg-black/50 border border-white/10 text-xs text-slate-300 font-mono">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <Link href={`/engineering/${article.slug}`} className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/20 text-white group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-black transition-all">
                                        <Code2 className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
