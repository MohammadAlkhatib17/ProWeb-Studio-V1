import sitemap from '../sitemap';

const expectedPaths = [
  '/',
  '/diensten',
  '/werkwijze',
  '/over-ons',
  '/contact',
  '/speeltuin',
  '/privacy',
  '/voorwaarden',
];

function extractPath(url: string) {
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    return url; // fallback for malformed URL in development
  }
}

describe('sitemap allowlist', () => {
  it('emits exactly 8 entries with expected paths', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://prowebstudio.nl';
    const entries = sitemap();
    expect(entries).toHaveLength(8);

    const paths = entries.map((e) => extractPath(e.url));
    expect(new Set(paths).size).toBe(8);
    expect(paths.sort()).toEqual([...expectedPaths].sort());
  });

  it('builds absolute URLs without trailing slash duplication', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://prowebstudio.nl/';
    const entries = sitemap();
    for (const e of entries) {
      expect(e.url.startsWith('https://prowebstudio.nl/')).toBe(true);
      expect(e.url.includes('//')).toBe(false);
    }
  });
});
