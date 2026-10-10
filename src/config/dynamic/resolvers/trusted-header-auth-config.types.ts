export type TrustedHeaderGrpcMetadataMapping = {
  /** Inbound request header name (matched case-insensitively). */
  inboundHeader: string;
  /** Outbound gRPC metadata key the value is forwarded under. */
  outboundKey: string;
};

/**
 * trusted-header strategy config, evaluated at serverStart.
 *
 * The user-id header is a temporary fallback for `/api/auth/me` until Cadence
 * answers identity. Name, email, groups, and admin are not header config —
 * they belong to that backend identity result.
 *
 * `grpcMetadataMap` is the only header forwarding. The user-id header is not
 * forwarded unless an operator lists it here.
 *
 * Header names match case-insensitively. Node joins duplicate inbound headers
 * with `', '`, so operators must configure headers the perimeter sets
 * (overwrites), never ones it appends.
 */
export type TrustedHeaderAuthConfig = {
  /** Fallback identity header until the backend identity call exists. */
  userIdHeader: string;
  /** Inbound-header → outbound-gRPC-metadata map. */
  grpcMetadataMap: TrustedHeaderGrpcMetadataMapping[];
};
