import 'server-only';

import { type AuthRequest } from '@/utils/auth/auth.types';
import getConfigValue from '@/utils/config/get-config-value';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

/**
 * Copy configured request headers into gRPC metadata keys.
 * Callers must check auth context before forwarding; this just applies the map.
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
