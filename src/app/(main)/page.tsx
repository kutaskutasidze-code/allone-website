import { Hero, DashboardShowcase, ServicesNew, Clients, WorkComingSoon, CTA } from '@/components/sections';
import { getCachedClients, getCachedServices } from '@/lib/cache';

export default async function HomePage() {
  const [clients, services] = await Promise.all([
    getCachedClients(),
    getCachedServices(),
  ]);

  return (
    <>
      <Hero />
      <DashboardShowcase />
      <ServicesNew services={services} />
      <Clients clients={clients} />
      <WorkComingSoon />
      <CTA />
    </>
  );
}
