import {
  type AuthServerPolicy,
  type ResolvedAuthServerRegistryEntry,
} from '../auth.types';

export function getMockAuthServerRegistryEntry(
  policyOverrides: Partial<AuthServerPolicy> = {}
): ResolvedAuthServerRegistryEntry {
  return {
    policy: {
      resolveAuthContext: jest.fn(),
      getGrpcMetadata: jest.fn(),
      getLoginRedirectIfNeeded: jest.fn(),
      recoverSession: jest.fn(),
      getSessionKey: jest.fn(),
      ...policyOverrides,
    },
    cookieNames: { exact: [], prefixes: [] },
  };
}
