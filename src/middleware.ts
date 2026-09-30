import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    'x-cadence-return-to',
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
