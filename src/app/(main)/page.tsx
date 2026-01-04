import { Hero, Services, Clients, ProjectsGrid, CTA } from '@/components/sections';
import {
  getCachedProjects,
  getCachedServices,
  getCachedClients,
} from '@/lib/cache';

export default async function HomePage() {
  // Fetch cached data in parallel
  const [projects, services, clients] = await Promise.all([
    getCachedProjects(),
    getCachedServices(),
    getCachedClients(),
  ]);

  return (
    <>
      <Hero />
      <Services services={services} />
      <Clients clients={clients} />
      <ProjectsGrid
        projects={projects}
        limit={3}
        showFilters={false}
        singleRow={true}
        showSeeAll={true}
      />
      <CTA />
    </>
  );
}
