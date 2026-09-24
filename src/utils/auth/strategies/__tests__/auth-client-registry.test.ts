import getAuthClientPolicy from '../auth-client-registry';
import disabledClientPolicy from '../disabled/disabled-client-policy';
import jwtClientPolicy from '../jwt/jwt-client-policy';

describe(getAuthClientPolicy.name, () => {
  it('returns the jwt client policy', () => {
    expect(getAuthClientPolicy('jwt')).toBe(jwtClientPolicy);
  });

  it('returns the disabled client policy', () => {
    expect(getAuthClientPolicy('disabled')).toBe(disabledClientPolicy);
  });

  it('returns undefined when no strategy is provided', () => {
    expect(getAuthClientPolicy(undefined)).toBeUndefined();
  });
});
