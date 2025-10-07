import { headers } from 'next/headers';
import React from 'react';

/**
 * Get the current request nonce for CSP (Server Components only)
 * This nonce is generated per-request in middleware and passed via headers
 */
export function getNonce(): string {
  const headersList = headers();
  return headersList.get('X-Nonce') || '';
}

/**
 * Server Component for rendering inline scripts with proper nonce
 * Use this instead of dangerouslySetInnerHTML for script content
 * Note: This only works in Server Components, not Client Components
 */
export function NonceScript({ 
  children, 
  type = 'application/ld+json' 
}: { 
  children: string; 
  type?: string; 
}): React.ReactElement {
  const nonce = getNonce();
  
  return React.createElement('script', {
    type,
    nonce,
    dangerouslySetInnerHTML: { __html: children }
  });
}

/**
 * Client-safe script component that receives nonce as prop
 * Use this in Client Components where you need to render scripts
 */
export function ClientNonceScript({ 
  children, 
  nonce,
  type = 'application/ld+json' 
}: { 
  children: string; 
  nonce: string;
  type?: string; 
}): React.ReactElement {
  return React.createElement('script', {
    type,
    nonce,
    dangerouslySetInnerHTML: { __html: children }
  });
}