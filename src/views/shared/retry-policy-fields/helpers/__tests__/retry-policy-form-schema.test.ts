import { retryPolicyValueSchema } from '../../schemas/retry-policy-form-schema';

describe('retryPolicyValueSchema', () => {
  it('accepts a decimal backoff coefficient of at least one', () => {
    expect(
      retryPolicyValueSchema.safeParse({ backoffCoefficient: '1.5' }).success
    ).toBe(true);
  });

  it.each(['0.5', 'invalid'])(
    'rejects invalid backoff coefficient %s',
    (backoffCoefficient) => {
      const result = retryPolicyValueSchema.safeParse({ backoffCoefficient });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toEqual([
          expect.objectContaining({
            path: ['backoffCoefficient'],
            message: 'Must be a number greater than or equal to 1',
          }),
        ]);
      }
    }
  );
});
