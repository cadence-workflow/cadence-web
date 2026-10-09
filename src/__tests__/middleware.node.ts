import { NextRequest } from 'next/server';

import { config, middleware } from '../middleware';

describe(middleware.name, () => {
  it('stamps the request path and query for the layout gate', () => {
    const response = middleware(
      new NextRequest('http://localhost/domains/default?view=active')
    );

    expect(
      response.headers.get('x-middleware-request-x-cadence-return-to')
    ).toBe('/domains/default?view=active');
  });

  it('does not run for API routes or framework assets', () => {
    expect(config.matcher).toEqual([
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]);
  });
});
