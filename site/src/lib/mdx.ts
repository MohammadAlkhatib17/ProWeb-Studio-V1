
import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/engineering');

export interface ArticleMeta {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    author: string;
    readingTime?: string;
    tags?: string[];
    featured?: boolean;
}

export interface Article {
    meta: ArticleMeta;
    content: any; // MDXRemoteSerializeResult
}

export function getAllArticles(): ArticleMeta[] {
    const fileNames = fs.readdirSync(contentDirectory);

    const allArticles = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            slug,
            ...data,
        } as ArticleMeta;
    });

    return allArticles.sort((a, b) => {
        if (a.publishedAt < b.publishedAt) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { content, data } = matter(fileContents);

    // Removed serialization logic
    // const mdxSource = await serialize(content, {
    //     mdxOptions: {
    //         rehypePlugins: [
    //             rehypeHighlight,
    //             rehypeSlug,
    //             [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    //         ],
    //     },
    // });

    return {
        meta: {
            slug,
            ...data,
        } as ArticleMeta,
        content: content, // Return raw content string
    };
}
