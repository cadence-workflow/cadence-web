import { sanitizeReturnTo } from '../sanitize-return-to';

describe(sanitizeReturnTo.name, () => {
  it('returns the default for nullish or empty input', () => {
    expect(sanitizeReturnTo(undefined)).toBe('/');
    expect(sanitizeReturnTo(null)).toBe('/');
    expect(sanitizeReturnTo('')).toBe('/');
  });

  it('returns the default for paths not starting with a slash', () => {
    expect(sanitizeReturnTo('domains/foo')).toBe('/');
  });

  it('rejects external URLs', () => {
    expect(sanitizeReturnTo('https://evil.test/phish')).toBe('/');
  });

  it('rejects protocol-relative URLs', () => {
    expect(sanitizeReturnTo('//evil.test/phish')).toBe('/');
  });

  it('rejects parser tricks that normalize to protocol-relative URLs', () => {
    // Browsers normalize backslashes and strip tabs/newlines, turning these
    // into protocol-relative URLs; the sentinel-origin parse catches them.
    expect(sanitizeReturnTo('/\\evil.test')).toBe('/');
    expect(sanitizeReturnTo('/\t/evil.test')).toBe('/');
    expect(sanitizeReturnTo('/\n/evil.test')).toBe('/');
  });

  it('rejects dot-segment tricks that normalize to a protocol-relative path', () => {
    // URL dot-segment removal turns these into pathname "//evil.test" with
    // the sentinel origin intact — the normalized pathname must be checked.
    expect(sanitizeReturnTo('/.//evil.test')).toBe('/');
    expect(sanitizeReturnTo('/a/..//evil.test')).toBe('/');
    expect(sanitizeReturnTo('/%2e//evil.test')).toBe('/');
  });

  it('rejects dot-segment tricks that normalize to a protocol-relative path', () => {
    // URL dot-segment removal turns these into pathname "//evil.test" with
    // the sentinel origin intact — the normalized pathname must be checked.
    expect(sanitizeReturnTo('/.//evil.test')).toBe('/');
    expect(sanitizeReturnTo('/a/..//evil.test')).toBe('/');
    expect(sanitizeReturnTo('/%2e//evil.test')).toBe('/');
  });

  it('keeps in-app paths with query and hash intact', () => {
    expect(sanitizeReturnTo('/domains/foo?tab=history#top')).toBe(
      '/domains/foo?tab=history#top'
    );
  });

  it('keeps the login page path', () => {
    expect(sanitizeReturnTo('/login?returnTo=%2Fdomains')).toBe(
      '/login?returnTo=%2Fdomains'
    );
  });
});
