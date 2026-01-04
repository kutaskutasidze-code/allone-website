import { ProjectsGrid, CTA } from '@/components/sections';
import { getCachedProjects } from '@/lib/cache';
import { ProjectsHero } from './ProjectsHero';

async function getProjects() {
  return getCachedProjects();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <ProjectsHero />
      <ProjectsGrid projects={projects} showHeader={false} />
      <CTA />
    </>
  );
}
