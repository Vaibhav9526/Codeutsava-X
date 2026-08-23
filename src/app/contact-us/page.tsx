import type { Metadata } from 'next';
import { BackgroundVideo } from '@/components/layout/BackgroundVideo';
import { Navbar } from '@/components/navbar/Navbar';
import { ContactSection } from '@/components/contact/ContactSection';
import { SiteFooter } from '@/components/footer/SiteFooter';

export const metadata: Metadata = {
  title: 'Contact Us - Codeutsava X.0',
  description: 'Reach out to the CodeUtsava X.0 team at NIT Raipur. Have some questions or inquiries? Transmit your message directly.',
};

export default function ContactPage() {
  return (
    <>
      {/* Background Video all over the page */}
      <BackgroundVideo />

      {/* Main Experience Wrapper */}
      <div className="flex min-h-screen flex-col bg-transparent relative z-10">
        {/* Glitchverse Navigation Bar with single BACK TO HOME button */}
        <Navbar variant="back-to-home" />

        {/* Contact Section Styled as FAQ with 2-Column Form & Maps Layout */}
        <main className="flex-1">
          <ContactSection />
        </main>

        {/* Glitchverse Site Footer */}
        <SiteFooter />
      </div>
    </>
  );
}
