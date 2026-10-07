import logger from '@/utils/logger';

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
 * trusted-header strategy config, evaluated at serverStart so
 * misconfiguration fails boot. The shared-secret pair is
 * optional-but-strongly-recommended: when it is entirely unset, boot carries
 * a prominent WARN — on direct network paths that bypass the perimeter
 * (pod-to-pod, SSRF, port-forward) the secret is the only thing
 * distinguishing a perimeter-injected header from a forged one.
 */
export default function trustedHeaderAuthConfig(): TrustedHeaderAuthConfig | null {
  if (authStrategy() !== 'trusted-header') {
    return null;
  }

  const userIdHeader = process.env.CADENCE_WEB_TRUSTED_HEADER_USER_ID?.trim();
  if (!userIdHeader) {
    throw new Error(
      'CADENCE_WEB_AUTH_STRATEGY=trusted-header requires: CADENCE_WEB_TRUSTED_HEADER_USER_ID'
    );
  }

  const headerNameEnvVars = {
    CADENCE_WEB_TRUSTED_HEADER_USER_ID: userIdHeader,
    CADENCE_WEB_TRUSTED_HEADER_EMAIL:
      process.env.CADENCE_WEB_TRUSTED_HEADER_EMAIL?.trim() || undefined,
    CADENCE_WEB_TRUSTED_HEADER_NAME:
      process.env.CADENCE_WEB_TRUSTED_HEADER_NAME?.trim() || undefined,
    CADENCE_WEB_TRUSTED_HEADER_GROUPS:
      process.env.CADENCE_WEB_TRUSTED_HEADER_GROUPS?.trim() || undefined,
    CADENCE_WEB_TRUSTED_HEADER_ADMIN:
      process.env.CADENCE_WEB_TRUSTED_HEADER_ADMIN?.trim() || undefined,
    CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER:
      process.env.CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER?.trim() ||
      undefined,
  };
  for (const [envVar, headerName] of Object.entries(headerNameEnvVars)) {
    if (headerName) {
      assertValidHeaderName(headerName, envVar);
    }
  }

  const sharedSecretHeader =
    headerNameEnvVars.CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER;
  const sharedSecret =
    process.env.CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET?.trim() || undefined;
  if (Boolean(sharedSecretHeader) !== Boolean(sharedSecret)) {
    throw new Error(
      'CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER and CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET must be set together'
    );
  }
  const grpcMetadataMap = parseGrpcMetadataMap(
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA
  );
  if (sharedSecretHeader) {
    // The secret must never be read back as identity or forwarded to Cadence.
    const secretHeader = sharedSecretHeader.toLowerCase();
    const otherHeaders = [
      ...Object.entries(headerNameEnvVars)
        .filter(
          ([envVar]) =>
            envVar !== 'CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER'
        )
        .map(([, name]) => name),
      ...grpcMetadataMap.map((m) => m.inboundHeader),
    ];
    if (otherHeaders.some((name) => name?.toLowerCase() === secretHeader)) {
      throw new Error(
        `CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER "${sharedSecretHeader}" must not be reused as an identity, admin, groups or metadata-map header`
      );
    }
  }
  if (!sharedSecret) {
    logger.warn(
      'trusted-header: no shared-secret pair configured; identity accepted from bare headers — perimeter stripping is the only defense'
    );
  }

  return {
    userIdHeader,
    emailHeader: headerNameEnvVars.CADENCE_WEB_TRUSTED_HEADER_EMAIL,
    nameHeader: headerNameEnvVars.CADENCE_WEB_TRUSTED_HEADER_NAME,
    groupsHeader: headerNameEnvVars.CADENCE_WEB_TRUSTED_HEADER_GROUPS,
    adminHeader: headerNameEnvVars.CADENCE_WEB_TRUSTED_HEADER_ADMIN,
    grpcMetadataMap,
    sharedSecretHeader,
    sharedSecret,
  };
}
