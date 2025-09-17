import { Metadata } from 'next';
import { generateMetaTags } from '@/lib/seo-config';

export const metadata: Metadata = {
  ...generateMetaTags('about'),
};

export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to the about page of our website.</p>
    </div>
  );
}