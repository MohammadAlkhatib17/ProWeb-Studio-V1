import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | ProWeb Studio',
  description: 'Our latest work and projects',
};

// Revalidate every 2 hours
export const revalidate = 7200;

async function getProjects() {
  const res = await fetch(`${process.env.API_URL}/api/projects`, {
    next: { 
      revalidate: 7200,
      tags: ['projects'] // Tag for on-demand revalidation
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  return res.json();
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <div key={project.id} className="group relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h2 className="text-white text-2xl font-bold">{project.title}</h2>
                <p className="text-white/80 mt-2">{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}