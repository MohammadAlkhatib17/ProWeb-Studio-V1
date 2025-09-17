import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { ProjectProps } from '../../../types/Project';
import { fadeInUp, stagger } from '../../../utils/animations';

const ProjectCard = lazy(() => import('./ProjectCard'));

const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-800 rounded-lg h-64"></div>
  </div>
);

export default function PortfolioGrid({ filter }: { filter: string }) {
  const filteredProjects: ProjectProps[] = []; // Assuming you have your projects data here

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {filteredProjects.map((project) => (
        <Suspense key={project.id} fallback={<CardLoader />}>
          <ProjectCard project={project} />
        </Suspense>
      ))}
    </motion.div>
  );
}