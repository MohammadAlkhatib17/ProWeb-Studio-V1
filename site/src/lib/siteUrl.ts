export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://prowebstudio.nl'
  ).replace(/\/+$/, '')
}

export function isPreview(): boolean {
  return process.env.VERCEL_ENV === 'preview'
}