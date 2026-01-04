import { CTA } from '@/components/sections';
import { AboutContent } from './AboutContent';
import {
  getCachedStats,
  getCachedValues,
  getCachedAboutContent,
} from '@/lib/cache';

async function getAboutData() {
  const [stats, values, about] = await Promise.all([
    getCachedStats(),
    getCachedValues(),
    getCachedAboutContent(),
  ]);

  return { stats, values, about };
}

export default async function AboutPage() {
  const { stats, values, about } = await getAboutData();

  return (
    <>
      <AboutContent stats={stats} values={values} about={about} />
      <CTA />
    </>
  );
}
