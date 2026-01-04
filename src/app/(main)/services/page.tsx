import { ServicesContent } from './ServicesContent';
import { CTA } from '@/components/sections';
import { getCachedServices } from '@/lib/cache';

export default async function ServicesPage() {
  const services = await getCachedServices();

  return (
    <>
      <ServicesContent services={services} />
      <CTA />
    </>
  );
}
