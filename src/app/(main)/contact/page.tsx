import { ContactContent } from './ContactContent';
import { getCachedContactInfo } from '@/lib/cache';

export default async function ContactPage() {
  const contactInfo = await getCachedContactInfo();

  return <ContactContent contactInfo={contactInfo} />;
}
