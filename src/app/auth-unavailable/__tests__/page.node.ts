import AuthUnavailablePage from '@/views/auth-unavailable-page/auth-unavailable-page';

import Page from '../page';

jest.mock('@/views/auth-unavailable-page/auth-unavailable-page', () =>
  jest.fn(function MockAuthUnavailablePage() {
    return null;
  })
);

describe('auth-unavailable route', () => {
  it('renders the status page view', () => {
    // The page lives outside the (Home) route group, so the layout gate
    // never redirects it onto itself.
    const element = Page();
    expect(element.type).toBe(AuthUnavailablePage);
  });
});
