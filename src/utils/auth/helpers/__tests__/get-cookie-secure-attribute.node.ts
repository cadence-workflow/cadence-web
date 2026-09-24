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
  return new NextRequest(`${options?.proto ?? 'http'}://localhost/`, {
    headers,
  });
};

describe(getCookieSecureAttribute.name, () => {
  it('honors x-forwarded-proto when present', () => {
    expect(
      getCookieSecureAttribute(buildRequest({ xForwardedProto: 'https' }))
    ).toBe(true);
    expect(
      getCookieSecureAttribute(buildRequest({ xForwardedProto: 'http' }))
    ).toBe(false);
  });

  it('uses the first entry of a comma-separated x-forwarded-proto', () => {
    expect(
      getCookieSecureAttribute(buildRequest({ xForwardedProto: 'https, http' }))
    ).toBe(true);
  });

  it('falls back to the request URL protocol', () => {
    expect(getCookieSecureAttribute(buildRequest({ proto: 'https' }))).toBe(
      true
    );
    expect(getCookieSecureAttribute(buildRequest({ proto: 'http' }))).toBe(
      false
    );
  });
});
