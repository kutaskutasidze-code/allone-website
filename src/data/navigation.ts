import type { NavItem } from '@/types';

export const navigation: NavItem[] = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Services', href: '/#services', key: 'services' },
  { label: 'About', href: '/about', key: 'about' },
  { label: 'Projects', href: '/#projects', key: 'projects' },
  { label: 'Contact', href: '/contact', key: 'contact' },
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
