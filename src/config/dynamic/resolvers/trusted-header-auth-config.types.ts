export type TrustedHeaderGrpcMetadataMapping = {
  /** Inbound request header name (matched case-insensitively). */
  inboundHeader: string;
  /** Outbound gRPC metadata key the value is forwarded under. */
  outboundKey: string;
};

/**
 * trusted-header strategy config, evaluated at serverStart.
 *
 * Identity belongs to the Cadence backend result, not header config.
 * `grpcMetadataMap` is the only header forwarding.
 *
 * Header names match case-insensitively. Node joins duplicate inbound headers
 * with `', '`, so operators must configure headers the perimeter sets
 * (overwrites), never ones it appends.
 */
export type TrustedHeaderAuthConfig = {
  /** Inbound-header → outbound-gRPC-metadata map. */
  grpcMetadataMap: TrustedHeaderGrpcMetadataMapping[];
};
