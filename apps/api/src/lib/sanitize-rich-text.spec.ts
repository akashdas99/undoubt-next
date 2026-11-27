import { afterEach, describe, expect, it } from 'vitest';
import { sanitizeRichText } from './sanitize-rich-text.js';

const original = process.env.NEXT_PUBLIC_CDNURL;
const image =
  '<img src="https://cdn.example.com/a.png" alt="pic" width="80" height="80">';

afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_CDNURL;
  else process.env.NEXT_PUBLIC_CDNURL = original;
});

describe('sanitizeRichText', () => {
  it('reads the CDN host when the function runs', () => {
    delete process.env.NEXT_PUBLIC_CDNURL;
    expect(sanitizeRichText(image)).not.toContain('cdn.example.com');

    process.env.NEXT_PUBLIC_CDNURL = 'https://cdn.example.com';
    expect(sanitizeRichText(image)).toContain('https://cdn.example.com/a.png');
  });

  it('rejects an image from a different host', () => {
    process.env.NEXT_PUBLIC_CDNURL = 'https://cdn.example.com';
    expect(
      sanitizeRichText('<img src="https://evil.example/a.png" alt="">'),
    ).not.toContain('evil.example');
  });
});
