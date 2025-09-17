import { Metadata } from 'next';
import { generateMetaTags } from '@/lib/seo-config';

export const metadata: Metadata = {
  ...generateMetaTags('contact'),
};

export default function ContactPage() {
  return (
    <div>
      {/* Contact page content */}
    </div>
  );
}