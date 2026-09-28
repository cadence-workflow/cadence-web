import decodeCadenceJwtClaims from '../decode-cadence-jwt-claims';

const buildToken = (claims: Record<string, unknown>) => {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return ['header', payload, 'signature'].join('.');
};

describe(decodeCadenceJwtClaims.name, () => {
  it('returns undefined for invalid tokens', () => {
    expect(decodeCadenceJwtClaims('invalid.token')).toBeUndefined();
  });

  it('decodes valid payloads', () => {
    const claims = { name: 'test-user', groups: 'group-a', admin: true };
    const token = buildToken(claims);

    expect(decodeCadenceJwtClaims(token)).toMatchObject(claims);
  });

  it('returns undefined when groups claim is not a string', () => {
    const token = buildToken({
      name: 'test-user',
      groups: ['group-a'],
      admin: true,
    });

    expect(decodeCadenceJwtClaims(token)).toBeUndefined();
  });

  it('returns undefined when claim types are invalid', () => {
    const token = buildToken({
      name: 123,
      admin: 'true',
    });

    expect(decodeCadenceJwtClaims(token)).toBeUndefined();
  });

  it('returns undefined for empty claims objects', () => {
    const token = buildToken({});

    expect(decodeCadenceJwtClaims(token)).toBeUndefined();
  });
});
