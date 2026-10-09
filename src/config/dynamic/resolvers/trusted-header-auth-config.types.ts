export type TrustedHeaderGrpcMetadataMapping = {
  /** Inbound request header name (matched case-insensitively). */
  inboundHeader: string;
  /** Outbound gRPC metadata key the value is forwarded under. */
  outboundKey: string;
};

/**
 * trusted-header strategy config, evaluated at serverStart.
 *
 * Header semantics (operator contract): header names match
 * case-insensitively (Node lowercases inbound header names; `Headers.get` is
 * case-insensitive), and Node JOINS duplicate inbound headers with `', '` —
 * operators must configure headers the perimeter *sets* (overwrites), never
 * ones it appends to, or a smuggled duplicate turns the value into a joined
 * list (which the exact-allowlist boolean parsing fails closed on).
 */
export type TrustedHeaderAuthConfig = {
  /** The designated identity header — exactly one. It is the identity source
   * for resolveAuthContext AND the getSessionKey pre-image (the verbatim raw
   * value; groups/admin headers never enter the pre-image). */
  userIdHeader: string;
  /** Optional display-identity headers (userName falls back name → email → id). */
  emailHeader?: string;
  nameHeader?: string;
  /** Optional group-membership header (comma/whitespace-separated list). */
  groupsHeader?: string;
  /** Optional admin flag header — exact allowlist 'true'/'1'/'yes' (trimmed,
   * lowercased), never JS truthiness. */
  adminHeader?: string;
  /** Inbound-header → outbound-gRPC-metadata map, forwarded only when the web
   * tier's own auth context is valid (the forwarding gate). */
  grpcMetadataMap: TrustedHeaderGrpcMetadataMapping[];
  /** Optional shared-secret pair (set together or not at all). When absent,
   * boot WARNs: identity is accepted from bare headers and perimeter
   * stripping is the only defense. */
  sharedSecretHeader?: string;
  sharedSecret?: string;
};
