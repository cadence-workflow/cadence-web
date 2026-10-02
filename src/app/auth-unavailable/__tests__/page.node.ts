import fs from 'fs';
import path from 'path';

import AuthUnavailablePage from '@/views/auth-unavailable-page/auth-unavailable-page';

import Page from '../page';

jest.mock('@/views/auth-unavailable-page/auth-unavailable-page', () =>
  jest.fn(function MockAuthUnavailablePage() {
    return null;
  })
);

describe('auth-unavailable route', () => {
  it('renders the status page view', () => {
    const element = Page();
    expect(element.type).toBe(AuthUnavailablePage);
  });

  it('lives outside the (Home) route group, so the layout gate never redirects it onto itself', () => {
    const pageDir = path.resolve(__dirname, '..');
    expect(pageDir.split(path.sep)).not.toContain('(Home)');
    expect(
      fs.existsSync(path.resolve(pageDir, '../(Home)/auth-unavailable'))
    ).toBe(false);
  });
});
