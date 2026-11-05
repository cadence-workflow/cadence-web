import parseTrustedHeaderGrpcMetadataMap from '@/utils/auth/strategies/trusted-header/parse-trusted-header-grpc-metadata-map';
import { TRUSTED_HEADER_GRPC_METADATA_ENV } from '@/utils/auth/strategies/trusted-header/parse-trusted-header-grpc-metadata-map.constants';

import authStrategy from './auth-strategy';
import { type TrustedHeaderAuthConfig } from './trusted-header-auth-config.types';

/**
 * Parse trusted-header env at serverStart. Null when strategy ≠ trusted-header.
 *
 * Only map headers the proxy overwrites. Node `headers.get` joins duplicates
 * with ", ", so if the proxy appends, a client-supplied prefix reaches gRPC
 * metadata (e.g. client `X-User-Id: evil` + proxy append → `"evil, real"`).
 */
export default function trustedHeaderAuthConfig(): TrustedHeaderAuthConfig | null {
  if (authStrategy() !== 'trusted-header') {
    return null;
  }

  return parseTrustedHeaderGrpcMetadataMap(
    process.env[TRUSTED_HEADER_GRPC_METADATA_ENV]
  );
}
