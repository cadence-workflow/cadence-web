import authStrategy from './auth-strategy';
import {
  type TrustedHeaderAuthConfig,
  type TrustedHeaderGrpcMetadataMapping,
} from './trusted-header-auth-config.types';

// RFC 9110 token — a valid HTTP header name. Invalid names throw per request
// in Headers.get; boot validation turns that into a boot failure.
const HTTP_HEADER_NAME_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
// grpc-js metadata keys. -bin keys require Buffer values, which this
// string-only mapping cannot produce — grpc-js throws per call on both.
const GRPC_METADATA_KEY_PATTERN = /^[0-9a-z_.-]+$/i;

function assertValidHeaderName(name: string, source: string): void {
  if (!HTTP_HEADER_NAME_PATTERN.test(name)) {
    throw new Error(`${source} is not a valid HTTP header name: "${name}"`);
  }
}

function parseGrpcMetadataMap(
  raw: string | undefined
): TrustedHeaderGrpcMetadataMapping[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw.split(',').map((pair) => {
    const parts = pair.split(':').map((s) => s.trim());
    const [inboundHeader, outboundKey] = parts;
    if (parts.length !== 2 || !inboundHeader || !outboundKey) {
      throw new Error(
        `CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA entry "${pair}" must be "inbound-header:outbound-key"`
      );
    }
    assertValidHeaderName(
      inboundHeader,
      'CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA inbound header'
    );
    if (
      !GRPC_METADATA_KEY_PATTERN.test(outboundKey) ||
      outboundKey.toLowerCase().endsWith('-bin')
    ) {
      throw new Error(
        `CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA entry "${pair}" has an invalid outbound key "${outboundKey}": keys must match ${GRPC_METADATA_KEY_PATTERN} and string values cannot use the -bin suffix`
      );
    }
    return { inboundHeader, outboundKey };
  });
}

/**
 * trusted-header config, parsed at serverStart. Identity comes from Cadence,
 * not headers. Inert until trusted-header is a registered strategy value.
 */
export default function trustedHeaderAuthConfig(): TrustedHeaderAuthConfig | null {
  // Widen the compare: trusted-header is not a registered strategy value yet,
  // so unknown env values still resolve to disabled and this stays inert.
  const strategy: string = authStrategy();
  if (strategy !== 'trusted-header') {
    return null;
  }

  return parseGrpcMetadataMap(
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA
  );
}
