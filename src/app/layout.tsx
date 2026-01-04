import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ALLONE | AI Automation Solutions',
    template: '%s | ALLONE',
  },
  description:
    'Transform your business with intelligent AI automation. We design and build custom AI solutions that automate complex workflows, enhance decision-making, and unlock unprecedented efficiency.',
  keywords: [
    'AI automation',
    'artificial intelligence',
    'chatbots',
    'workflow automation',
    'custom AI solutions',
    'machine learning',
    'business automation',
  ],
  authors: [{ name: 'ALLONE' }],
  creator: 'ALLONE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allone.ai',
    siteName: 'ALLONE',
    title: 'ALLONE | AI Automation Solutions',
    description:
      'Transform your business with intelligent AI automation. Custom AI solutions for modern enterprises.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALLONE | AI Automation Solutions',
    description:
      'Transform your business with intelligent AI automation.',
    creator: '@allone_ai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
