import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | ProWeb Studio',
  description: 'Latest articles and insights on web development',
};

// Revalidate every hour
export const revalidate = 3600;

async function getBlogPosts() {
  // Fetch blog posts from CMS or database
  const res = await fetch(`${process.env.API_URL}/api/posts`, {
    next: { revalidate: 3600 } // ISR with 1 hour revalidation
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <article key={post.id} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <a href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              Read more →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
