import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Generate static params for known blog posts
export async function generateStaticParams() {
  const posts = await fetch(`${process.env.API_URL}/api/posts`).then(res => res.json());
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

// Revalidate every 30 minutes
export const revalidate = 1800;

async function getPost(slug: string) {
  const res = await fetch(`${process.env.API_URL}/api/posts/${slug}`, {
    next: { revalidate: 1800 }
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: `${post.title} | ProWeb Studio`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <time className="text-gray-600">{new Date(post.date).toLocaleDateString()}</time>
      <div className="prose prose-lg mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
