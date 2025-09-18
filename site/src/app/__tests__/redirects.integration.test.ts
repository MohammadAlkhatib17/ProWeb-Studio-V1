import { beforeAll, describe, expect, it } from 'vitest';

const BASE = 'http://localhost:3000';
const slugs = [
  'website-laten-maken',
  '3d-website-ontwikkeling',
  'seo-optimalisatie',
  'webshop-laten-maken',
];

async function head(url: string) {
  const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location') };
}

describe('legacy slug redirects', () => {
  beforeAll(() => {
    // assumes app is running on :3000 via `npm start` or `npm run dev`
  });

  it('redirects each legacy slug (varied casing, with/without slash) in one hop to /diensten', async () => {
    const variants: string[] = [];
    for (const s of slugs) {
      variants.push(`/diensten/${s}`);
      variants.push(`/diensten/${s}/`);
      variants.push(`/diensten/${s.toUpperCase()}`);
      variants.push(`/diensten/${s.toUpperCase()}/`);
      // Mixed case check
      const mix = s
        .split('')
        .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join('');
      variants.push(`/diensten/${mix}`);
    }

    for (const v of variants) {
      const { status, location } = await head(`${BASE}${v}`);
      expect([301, 308]).toContain(status);
      expect(location).toBe('/diensten');
    }
  });
});
