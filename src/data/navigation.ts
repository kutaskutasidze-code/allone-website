import type { NavItem } from '@/types';

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Projects', href: '/#projects' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'AI Chatbots', href: '/#services' },
    { label: 'Workflow Automation', href: '/#services' },
    { label: 'Custom AI Solutions', href: '/#services' },
    { label: 'AI Consulting', href: '/#services' },
  ],
};
