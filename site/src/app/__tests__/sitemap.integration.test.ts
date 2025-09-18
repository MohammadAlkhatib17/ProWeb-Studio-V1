import { beforeAll, describe, it, expect } from 'vitest';

const BASE = 'http://localhost:3000';
const expectedLocs = [
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/diensten`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/werkwijze`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/over-ons`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/contact`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/speeltuin`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/privacy`,
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/voorwaarden`,
];

async function fetchText(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

describe('sitemap integration', () => {
  let xml: string;
  beforeAll(async () => {
    xml = await fetchText(`${BASE}/sitemap.xml`);
  });

  it('contains exactly eight <loc> entries and only allowlisted URLs', () => {
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
    expect(locs.length).toBe(8);
    expect(locs.sort()).toEqual([...expectedLocs].sort());
  });
});
