import { describe, it, expect } from 'vitest';

import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeUserInput,
  sanitizeObject,
  createSafeMarkup,
} from '@/lib/sanitize';

describe('HTML Sanitization', () => {
  describe('sanitizeText', () => {
    it('should remove all HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeText(input);
      
      expect(result).toBe('Hello World');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should neutralize XSS payload with script tags', () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const result = sanitizeText(xssPayload);
      
      expect(result).toBe('');
      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should neutralize XSS payload with img onerror', () => {
      const xssPayload = '<img src=x onerror="alert(\'XSS\')">';
      const result = sanitizeText(xssPayload);
      
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
      expect(result).not.toContain('<img');
    });

    it('should neutralize XSS payload with iframe', () => {
      const xssPayload = '<iframe src="javascript:alert(\'XSS\')"></iframe>';
      const result = sanitizeText(xssPayload);
      
      expect(result).not.toContain('iframe');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });

    it('should neutralize XSS payload with svg onload', () => {
      const xssPayload = '<svg onload="alert(\'XSS\')"></svg>';
      const result = sanitizeText(xssPayload);
      
      expect(result).not.toContain('svg');
      expect(result).not.toContain('onload');
      expect(result).not.toContain('alert');
    });

    it('should neutralize XSS payload with javascript protocol', () => {
      const xssPayload = '<a href="javascript:alert(\'XSS\')">Click me</a>';
      const result = sanitizeText(xssPayload);
      
      expect(result).toBe('Click me');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('<a');
    });

    it('should neutralize XSS payload with data protocol', () => {
      const xssPayload = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>';
      const result = sanitizeText(xssPayload);
      
      expect(result).toBe('Click');
      expect(result).not.toContain('data:');
      expect(result).not.toContain('script');
    });

    it('should neutralize complex nested XSS payload', () => {
      const xssPayload = '<div><script>alert(1)</script><img src=x onerror=alert(2)><svg/onload=alert(3)></div>';
      const result = sanitizeText(xssPayload);
      
      expect(result).not.toContain('script');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('onload');
      expect(result).not.toContain('alert');
    });

    it('should preserve plain text content', () => {
      const input = 'This is plain text with no HTML';
      const result = sanitizeText(input);
      
      expect(result).toBe(input);
    });

    it('should handle empty strings', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtml(input);
      
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should remove script tags but keep content', () => {
      const input = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
      const result = sanitizeHtml(input);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('<p>Hello</p>');
      expect(result).toContain('<p>World</p>');
    });

    it('should remove dangerous attributes', () => {
      const input = '<a href="#" onclick="alert(\'XSS\')">Link</a>';
      const result = sanitizeHtml(input);
      
      expect(result).not.toContain('onclick');
      expect(result).toContain('Link');
    });

    it('should allow safe href attributes', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtml(input);
      
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('Link');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow HTTP URLs', () => {
      const url = 'http://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should allow HTTPS URLs', () => {
      const url = 'https://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should block javascript: protocol', () => {
      const url = 'javascript:alert("XSS")';
      expect(sanitizeUrl(url)).toBe('');
    });

    it('should block data: protocol', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>';
      expect(sanitizeUrl(url)).toBe('');
    });

    it('should block vbscript: protocol', () => {
      const url = 'vbscript:alert("XSS")';
      expect(sanitizeUrl(url)).toBe('');
    });

    it('should block file: protocol', () => {
      const url = 'file:///etc/passwd';
      expect(sanitizeUrl(url)).toBe('');
    });

    it('should handle empty strings', () => {
      expect(sanitizeUrl('')).toBe('');
    });
  });

  describe('sanitizeUserInput', () => {
    it('should sanitize text and remove HTML', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeUserInput(input);
      
      expect(result).toBe('Hello');
    });

    it('should truncate long inputs', () => {
      const input = 'a'.repeat(20000);
      const result = sanitizeUserInput(input, 1000);
      
      expect(result.length).toBe(1000);
    });

    it('should handle empty inputs', () => {
      expect(sanitizeUserInput('')).toBe('');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string properties', () => {
      const obj = {
        name: '<script>alert(1)</script>John',
        email: 'test@example.com',
        message: '<img src=x onerror=alert(2)>Hello',
      };
      
      const result = sanitizeObject(obj);
      
      expect(result.name).toBe('John');
      expect(result.email).toBe('test@example.com');
      expect(result.message).toBe('Hello');
    });

    it('should handle nested objects', () => {
      const obj = {
        user: {
          name: '<script>alert(1)</script>John',
          profile: {
            bio: '<img src=x onerror=alert(2)>Developer',
          },
        },
      };
      
      const result = sanitizeObject(obj);
      
      expect(result.user.name).toBe('John');
      expect(result.user.profile.bio).toBe('Developer');
    });

    it('should handle arrays', () => {
      const obj = {
        tags: ['<script>alert(1)</script>tag1', 'tag2'],
      };
      
      const result = sanitizeObject(obj);
      
      expect(result.tags[0]).toBe('tag1');
      expect(result.tags[1]).toBe('tag2');
    });

    it('should preserve non-string values', () => {
      const obj = {
        name: 'John',
        age: 30,
        active: true,
        score: 95.5,
      };
      
      const result = sanitizeObject(obj);
      
      expect(result.age).toBe(30);
      expect(result.active).toBe(true);
      expect(result.score).toBe(95.5);
    });
  });

  describe('createSafeMarkup', () => {
    it('should create safe markup object for React', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = createSafeMarkup(html);
      
      expect(result).toHaveProperty('__html');
      expect(result.__html).toContain('<p>');
      expect(result.__html).toContain('<strong>');
    });

    it('should sanitize dangerous content', () => {
      const html = '<script>alert("xss")</script><p>Safe content</p>';
      const result = createSafeMarkup(html);
      
      expect(result.__html).not.toContain('<script>');
      expect(result.__html).toContain('<p>Safe content</p>');
    });
  });

  describe('XSS Attack Vectors', () => {
    const xssVectors = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)>',
      '<iframe src=javascript:alert(1)>',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      '<select onfocus=alert(1) autofocus>',
      '<textarea onfocus=alert(1) autofocus>',
      '<marquee onstart=alert(1)>',
      '<details open ontoggle=alert(1)>',
      '"><script>alert(1)</script>',
      '\'><script>alert(1)</script>',
      '<scr<script>ipt>alert(1)</scr</script>ipt>',
      '<IMG SRC="javascript:alert(\'XSS\');">',
      '<IMG SRC=JaVaScRiPt:alert(\'XSS\')>',
      '<IMG SRC=`javascript:alert("XSS")`>',
      '<object data="javascript:alert(\'XSS\')">',
      '<embed src="javascript:alert(\'XSS\')">',
    ];

    xssVectors.forEach((vector, index) => {
      it(`should neutralize XSS vector #${index + 1}: ${vector.substring(0, 50)}...`, () => {
        const result = sanitizeText(vector);
        
        // Should not contain script tags or event handlers
        expect(result).not.toContain('<script');
        expect(result).not.toContain('</script>');
        expect(result).not.toContain('onerror=');
        expect(result).not.toContain('onload=');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('onfocus=');
        expect(result).not.toContain('onstart=');
        expect(result).not.toContain('ontoggle=');
        
        // If alert appears, it should not be in an executable context
        if (result.includes('alert')) {
          // Should be HTML-encoded or part of plain text, not executable
          expect(result).not.toMatch(/<[^>]*alert\([^)]*\)/);
        }
      });
    });
  });
});
