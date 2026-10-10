import authStrategy from './auth-strategy';
import {
  type TrustedHeaderAuthConfig,
  type TrustedHeaderGrpcMetadataMapping,
} from './trusted-header-auth-config.types';

function parseGrpcMetadataMap(
  raw: string | undefined
): TrustedHeaderGrpcMetadataMapping[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw.split(',').map((pair) => {
    const [inboundHeader, outboundKey] = pair.split(':').map((s) => s.trim());
    if (!inboundHeader || !outboundKey) {
      throw new Error(
        `CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA entry "${pair}" must be "inbound-header:outbound-key"`
      );
    }
    return { inboundHeader, outboundKey };
  });
}

/**
 * trusted-header strategy config, evaluated at serverStart. Identity comes
 * from Cadence, not headers. This resolver stays inert until trusted-header
 * is a registered strategy value.
 */
export default function trustedHeaderAuthConfig(): TrustedHeaderAuthConfig | null {
  // Widen the compare: trusted-header is not a registered strategy value yet,
  // so unknown env values still resolve to disabled and this resolver stays inert.
  const strategy: string = authStrategy();
  if (strategy !== 'trusted-header') {
    return null;
  }

  return {
    grpcMetadataMap: parseGrpcMetadataMap(
      process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA
    ),
  };
}
