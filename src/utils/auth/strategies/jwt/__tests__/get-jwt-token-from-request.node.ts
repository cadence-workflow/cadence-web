import { getMockJwtAuthRequest } from '../__fixtures__/mock-jwt-auth-request';
import getJwtTokenFromRequest from '../get-jwt-token-from-request';

describe(getJwtTokenFromRequest.name, () => {
  it('returns the trimmed token', () => {
    expect(getJwtTokenFromRequest(getMockJwtAuthRequest('  abc  '))).toBe(
      'abc'
    );
  });

  it('returns undefined when the cookie is absent or blank', () => {
    expect(getJwtTokenFromRequest(getMockJwtAuthRequest())).toBeUndefined();
    expect(
      getJwtTokenFromRequest(getMockJwtAuthRequest('   '))
    ).toBeUndefined();
  });
});
