import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type PublicAuthContext } from '@/utils/auth/auth-shared.types';
import { type AuthClientPolicy } from '@/utils/auth/auth.types';
import jwtClientPolicy from '@/utils/auth/strategies/jwt/jwt-client-policy';

import useAuthLifecycle from '../use-auth-lifecycle';

jest.mock('@/utils/auth/strategies/jwt/jwt-client-policy', () => ({
  __esModule: true,
  default: {
    supportsSessionRecovery: false,
    unauthenticatedRemedy: 'login',
    login: jest.fn(),
    logout: jest.fn().mockResolvedValue(undefined),
    onUnauthorized: jest.fn(),
  },
}));

const mockPolicy = jwtClientPolicy as jest.Mocked<AuthClientPolicy>;

const AUTH_ENABLED: PublicAuthContext = {
  authEnabled: true,
  auth: { isValidToken: true },
  groups: [],
  isAdmin: false,
  userName: 'alice',
};

const AUTH_DISABLED: PublicAuthContext = {
  authEnabled: false,
  auth: { isValidToken: false },
  groups: [],
  isAdmin: false,
};

const AUTH_UNAUTHENTICATED: PublicAuthContext = {
  authEnabled: true,
  auth: { isValidToken: false },
  groups: [],
  isAdmin: false,
};

const AUTH_ADMIN: PublicAuthContext = {
  authEnabled: true,
  auth: { isValidToken: true },
  groups: [],
  isAdmin: true,
  userName: 'admin-user',
};

describe(useAuthLifecycle.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('derived state', () => {
    it('returns disabled auth state when auth is disabled', async () => {
      const { result } = setup({ authResponse: AUTH_DISABLED });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(false);
        expect(result.current.isAuthLoading).toBe(false);
      });

      expect(result.current.isAdmin).toBe(false);
      expect(result.current.userName).toBeUndefined();
    });

    it('returns unauthenticated state when token is invalid', async () => {
      const { result } = setup({ authResponse: AUTH_UNAUTHENTICATED });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      expect(result.current.isValidToken).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.userName).toBeUndefined();
    });

    it('returns authenticated state with user info', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(result.current.isAdmin).toBe(false);
      expect(result.current.userName).toBe('alice');
    });

    it('returns admin state for admin users', async () => {
      const { result } = setup({ authResponse: AUTH_ADMIN });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(result.current.isAdmin).toBe(true);
      expect(result.current.userName).toBe('admin-user');
    });

    it('returns expiresAtMs from auth info', async () => {
      const expiresAtMs = Date.now() + 60_000;
      const { result } = setup({
        authResponse: {
          ...AUTH_ENABLED,
          auth: { isValidToken: true, expiresAtMs },
        },
      });

      await waitFor(() => {
        expect(result.current.expiresAtMs).toBe(expiresAtMs);
      });
    });

    it('returns undefined expiresAtMs when absent', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(result.current.expiresAtMs).toBeUndefined();
    });
  });

  describe('policy delegation', () => {
    it('logout dispatches to the client policy with the notice', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      await result.current.logout({ notice: 'signed-out' });

      expect(mockPolicy.logout).toHaveBeenCalledWith({ notice: 'signed-out' });
    });
  });
});

function setup({ authResponse }: { authResponse: PublicAuthContext }) {
  const { result } = renderHook(() => useAuthLifecycle(), {
    endpointsMocks: [
      {
        path: '/api/auth/me',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: () => HttpResponse.json(authResponse),
      },
    ],
  });

  return { result };
}
