import { NextRequest } from 'next/server';

import getCookieSecureAttribute from '../get-cookie-secure-attribute';

const buildRequest = (options?: {
  proto?: string;
  xForwardedProto?: string;
}) => {
  const headers = new Headers();
  if (options?.xForwardedProto) {
    headers.set('x-forwarded-proto', options.xForwardedProto);
  }

  return new NextRequest(
    `${options?.proto ?? 'http'}://localhost/api/auth/token`,
    {
      headers,
    }
  );
};

describe(getCookieSecureAttribute.name, () => {
  it('returns true when x-forwarded-proto is https', () => {
    expect(
      getCookieSecureAttribute(buildRequest({ xForwardedProto: 'https' }))
    ).toBe(true);
  });

  it('returns false when x-forwarded-proto is http', () => {
    expect(
      getCookieSecureAttribute(buildRequest({ xForwardedProto: 'http' }))
    ).toBe(false);
  });

  it('uses the first x-forwarded-proto value', () => {
    expect(
      getCookieSecureAttribute(buildRequest({ xForwardedProto: 'https, http' }))
    ).toBe(true);
  });

  it('falls back to the request protocol when x-forwarded-proto is missing', () => {
    expect(getCookieSecureAttribute(buildRequest({ proto: 'https' }))).toBe(
      true
    );
  });
});
