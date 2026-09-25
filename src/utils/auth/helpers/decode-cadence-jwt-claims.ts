import { type CadenceJwtClaims } from '../auth.types';
import { cadenceJwtClaimsSchema } from '../schemas/cadence-jwt-claims-schema';

export default function decodeCadenceJwtClaims(
  token: string
): CadenceJwtClaims | undefined {
  const [, payload] = token.split('.');
  if (!payload) {
    return undefined;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload =
      normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
    const decodedPayload = Buffer.from(paddedPayload, 'base64').toString(
      'utf8'
    );

    const parsed = JSON.parse(decodedPayload);
    const result = cadenceJwtClaimsSchema.safeParse(parsed);
    if (!result.success) {
      return undefined;
    }
    return result.data;
  } catch {
    return undefined;
  }
}
