'use client';

import { Header, Footer } from '@/components/layout';
import { ContactInfoProvider, LanguageProvider } from '@/contexts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ChatProvider } from '@/components/chat';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <ContactInfoProvider>
        <ChatProvider>
          <ErrorBoundary>
            <Header />
            <main className="min-h-screen relative">{children}</main>
            <Footer />
          </ErrorBoundary>
        </ChatProvider>
      </ContactInfoProvider>
    </LanguageProvider>
  );
}
