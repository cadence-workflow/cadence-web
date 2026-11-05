import {
  GRPC_METADATA_KEY_PATTERN,
  HTTP_HEADER_NAME_PATTERN,
  TRUSTED_HEADER_GRPC_METADATA_ENV,
} from './parse-trusted-header-grpc-metadata-map.constants';
import { type TrustedHeaderGrpcMetadataMapping } from './parse-trusted-header-grpc-metadata-map.types';

/**
 * Parse inbound-header:outbound-key pairs for trusted-header gRPC metadata.
 * Throws on malformed entries so bad config fails at boot.
 */
export default function parseTrustedHeaderGrpcMetadataMap(
  raw: string | undefined,
  source = TRUSTED_HEADER_GRPC_METADATA_ENV
): TrustedHeaderGrpcMetadataMapping[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw.split(',').map((pair) => {
    const parts = pair.split(':').map((s) => s.trim());
    const [inboundHeader, outboundKey] = parts;
    if (parts.length !== 2 || !inboundHeader || !outboundKey) {
      throw new Error(
        `${source} entry "${pair}" must be "inbound-header:outbound-key"`
      );
    }
    if (!HTTP_HEADER_NAME_PATTERN.test(inboundHeader)) {
      throw new Error(
        `${source} entry "${pair}" has an invalid inbound header "${inboundHeader}": not a valid HTTP header name`
      );
    }
    // -bin keys require Buffer values; GRPCMetadata is string-only, so
    // grpc-js would throw on every call if we allowed them here.
    if (
      !GRPC_METADATA_KEY_PATTERN.test(outboundKey) ||
      outboundKey.toLowerCase().endsWith('-bin')
    ) {
      throw new Error(
        `${source} entry "${pair}" has an invalid outbound key "${outboundKey}": keys must match ${GRPC_METADATA_KEY_PATTERN} and string values cannot use the -bin suffix`
      );
    }
    // __proto__ matches the key pattern but assignment on a plain object
    // hits Object.prototype.__proto__ and silently drops the entry.
    if (outboundKey.toLowerCase() === '__proto__') {
      throw new Error(
        `${source} entry "${pair}" has an invalid outbound key "${outboundKey}"`
      );
    }
    return { inboundHeader, outboundKey };
  });
}
