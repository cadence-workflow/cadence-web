export type TrustedHeaderGrpcMetadataMapping = {
  /** Request header name, matched case-insensitively. */
  inboundHeader: string;
  /** gRPC metadata key the value is forwarded under. */
  outboundKey: string;
};

/**
 * trusted-header config: the inbound-header → gRPC-metadata map. Identity
 * comes from Cadence, not headers, so this map is the whole config.
 *
 * Node joins duplicate inbound headers with `', '`, so configure headers the
 * perimeter overwrites, never ones it appends.
 */
export type TrustedHeaderAuthConfig = TrustedHeaderGrpcMetadataMapping[];
