import 'server-only';

import { type TrustedHeaderAuthConfig } from '@/config/dynamic/resolvers/trusted-header-auth-config.types';
import { splitGroupList } from '@/utils/auth/auth-shared';
import { type AuthContext, type AuthRequest } from '@/utils/auth/auth.types';
import getConfigValue from '@/utils/config/get-config-value';

const UNAUTHENTICATED_CONTEXT: AuthContext = {
  authEnabled: true,
  auth: { isValidToken: false, canRefresh: false },
  isAdmin: false,
  groups: [],
};

/**
 * Exact allowlist (trimmed, lowercased) — never JS truthiness
 * (`Boolean('false') === true`). Node joins duplicate inbound headers with
 * `', '`, so a smuggled duplicate reads 'true, false' — not in the
 * allowlist, hence not admin (fails closed).
 */
const TRUTHY_HEADER_VALUES = ['true', '1', 'yes'];

function isTruthyHeaderValue(value: string | null): boolean {
  return (
    value !== null && TRUTHY_HEADER_VALUES.includes(value.trim().toLowerCase())
  );
}

/**
 * Shared-secret check: `crypto.timingSafeEqual`, length-mismatch-safe —
 * unequal lengths are invalid (no padding, no try/catch default-allow).
 * When no pair is configured the boot WARN has already fired and bare
 * headers are accepted: perimeter stripping is the only defense.
 */
function hasValidSharedSecret(
  config: TrustedHeaderAuthConfig,
  request: AuthRequest
): boolean {
  if (!config.sharedSecretHeader || !config.sharedSecret) {
    return true;
  }
  const provided = request.headers.get(config.sharedSecretHeader);
  if (provided === null) {
    return false;
  }
  // The builtin is resolved at call time, not imported: the edge
  // instrumentation bundle statically compiles this module's import graph
  // (instrumentation → dynamic config → resolvers → server registry) though
  // it never executes it, and a static crypto import fails that build. This
  // module is server-only and only ever runs in the Node.js runtime.
  const { timingSafeEqual } = process.getBuiltinModule('node:crypto');
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(config.sharedSecret);
  if (providedBytes.length !== expectedBytes.length) {
    return false;
  }
  return timingSafeEqual(providedBytes, expectedBytes);
}

export default async function resolveTrustedHeaderAuthContext(
  request: AuthRequest
): Promise<AuthContext> {
  const config = await getConfigValue('TRUSTED_HEADER_AUTH_CONFIG');
  if (!config || !hasValidSharedSecret(config, request)) {
    return UNAUTHENTICATED_CONTEXT;
  }

  const id = request.headers.get(config.userIdHeader)?.trim();
  if (!id) {
    return UNAUTHENTICATED_CONTEXT;
  }

  const userName =
    (config.nameHeader && request.headers.get(config.nameHeader)?.trim()) ||
    (config.emailHeader && request.headers.get(config.emailHeader)?.trim()) ||
    id;
  const groups = config.groupsHeader
    ? splitGroupList(request.headers.get(config.groupsHeader) ?? '')
    : [];
  const isAdmin = config.adminHeader
    ? isTruthyHeaderValue(request.headers.get(config.adminHeader))
    : false;

  return {
    authEnabled: true,
    auth: { isValidToken: true, canRefresh: false },
    groups,
    isAdmin,
    id,
    userName,
  };
}
