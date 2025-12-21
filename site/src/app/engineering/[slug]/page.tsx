import Link from 'next/link';
import { Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

import { getArticleBySlug, getAllArticles } from '@/lib/mdx';

import type { Metadata } from 'next';

// Force static generation
export const dynamic = 'force-static';

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { meta } = await getArticleBySlug(slug);
    return {
        title: `${meta.title} | ProWeb Engineering`,
        description: meta.description,
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { meta, content } = await getArticleBySlug(slug);

    return (
        <main className="relative min-h-screen pt-24 pb-24">
            {/* Progress Bar (would be nice, maybe later) */}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                <Link href="/engineering" className="inline-flex items-center text-slate-400 hover:text-cyan-400 mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Terug naar Overzicht
                </Link>

                <header className="mb-16 border-b border-white/10 pb-12">
                    <div className="flex flex-wrap gap-4 text-sm font-mono text-cyan-500 mb-6">
                        <span className="flex items-center gap-2 bg-cyan-900/10 px-3 py-1 rounded-full border border-cyan-900/30">
                            <Calendar className="w-3 h-3" /> {meta.publishedAt}
                        </span>
                        <span className="flex items-center gap-2 bg-cyan-900/10 px-3 py-1 rounded-full border border-cyan-900/30">
                            <User className="w-3 h-3" /> {meta.author}
                        </span>
                        {meta.readingTime && (
                            <span className="flex items-center gap-2 bg-cyan-900/10 px-3 py-1 rounded-full border border-cyan-900/30">
                                <Clock className="w-3 h-3" /> {meta.readingTime}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        {meta.title}
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed font-light">
                        {meta.description}
                    </p>
                </header>

                <div className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10">
                    <MDXRemote
                        source={content}
                        options={{
                            mdxOptions: {
                                rehypePlugins: [
                                    rehypeHighlight,
                                    rehypeSlug,
                                ],
                            }
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
