import tokenRequestBodySchema from '../token-request-body-schema';

describe('token request validation messages', () => {
  it.each([
    [{}, 'Token is required'],
    [{ token: undefined }, 'Token is required'],
    [{ token: null }, 'Token must be a string'],
    [{ token: 1 }, 'Token must be a string'],
    [{ token: false }, 'Token must be a string'],
    [{ token: [] }, 'Token must be a string'],
    [{ token: {} }, 'Token must be a string'],
    [{ token: '' }, 'Token cannot be empty'],
    [{ token: '  ' }, 'Token cannot be empty'],
    [
      { token: 'Bearer ' },
      'Token must be a JWT in header.payload.signature format',
    ],
    [
      { token: 'not-a-jwt' },
      'Token must be a JWT in header.payload.signature format',
    ],
    [null, 'Request body must be a JSON object'],
    [[], 'Request body must be a JSON object'],
    ['token', 'Request body must be a JSON object'],
  ])('reports the correct first message for %p', (input, message) => {
    const result = tokenRequestBodySchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('keeps both refinement errors for an empty token in the same order', () => {
    const result = tokenRequestBodySchema.safeParse({ token: '' });
    expect(
      result.error?.issues.map(({ path, message }) => ({ path, message }))
    ).toEqual([
      { path: ['token'], message: 'Token cannot be empty' },
      {
        path: ['token'],
        message: 'Token must be a JWT in header.payload.signature format',
      },
    ]);
  });

  it('still trims the bearer prefix from a valid token', () => {
    expect(
      tokenRequestBodySchema.parse({
        token: '  Bearer header.payload.signature  ',
      })
    ).toEqual({ token: 'header.payload.signature' });
  });
});
