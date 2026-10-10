import 'server-only';

import { type AuthRequest } from '@/utils/auth/auth.types';
import getConfigValue from '@/utils/config/get-config-value';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

/**
 * The configured inbound-header → outbound-key mapping, verbatim values.
 * Callers own the forwarding gate (context validity) — this is the pure map,
 * and the only surface configured headers may leave on.
 */
export default async function getTrustedHeaderGrpcMetadata(
  request: AuthRequest
): Promise<GRPCMetadata | undefined> {
  const map = await getConfigValue('TRUSTED_HEADER_AUTH_CONFIG');
  if (!map) {
    return undefined;
  }

  const metadata: GRPCMetadata = {};
  for (const { inboundHeader, outboundKey } of map) {
    const value = request.headers.get(inboundHeader);
    if (value) {
      metadata[outboundKey] = value;
    }
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}
