import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import {
  type AuthClientPolicy,
  type AuthMeResponse,
} from '@/utils/auth/auth.types';
import { handleApiUnauthorized } from '@/utils/auth/recovery/handle-api-unauthorized';
import getAuthClientPolicy from '@/utils/auth/strategies/get-auth-client-policy';
import { server } from '@/utils/msw/node';

import useAuthLifecycle from '../use-auth-lifecycle';

const mockPolicy: jest.Mocked<AuthClientPolicy> = {
  supportsSessionRecovery: false,
  unauthenticatedRemedy: 'login',
  login: jest.fn(),
  logout: jest.fn().mockResolvedValue(undefined),
  onUnauthorized: jest.fn((_response: Response) => true),
};

jest.mock('@/utils/auth/strategies/get-auth-client-policy', () => ({
  __esModule: true,
  default: jest.fn(() => mockPolicy),
}));

jest.mock('@/utils/auth/recovery/handle-api-unauthorized', () => ({
  handleApiUnauthorized: jest.fn(),
}));

const mockGetAuthClientPolicy = getAuthClientPolicy as jest.MockedFunction<
  typeof getAuthClientPolicy
>;

const mockHandleApiUnauthorized = handleApiUnauthorized as jest.MockedFunction<
  typeof handleApiUnauthorized
>;

const AUTH_ENABLED: AuthMeResponse = {
  authEnabled: true,
  authStrategy: 'jwt',
  auth: { isValidToken: true },
  isAdmin: false,
  userName: 'alice',
};

const AUTH_DISABLED: AuthMeResponse = {
  authEnabled: false,
  authStrategy: 'disabled',
  auth: { isValidToken: false },
  isAdmin: false,
};

const AUTH_UNAUTHENTICATED: AuthMeResponse = {
  authEnabled: true,
  authStrategy: 'jwt',
  auth: { isValidToken: false },
  isAdmin: false,
};

const AUTH_ADMIN: AuthMeResponse = {
  authEnabled: true,
  authStrategy: 'jwt',
  auth: { isValidToken: true },
  isAdmin: true,
  userName: 'admin-user',
};

describe(useAuthLifecycle.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPolicy.supportsSessionRecovery = false;
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
    it('resolves the policy from the me response strategy', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(mockGetAuthClientPolicy).toHaveBeenCalledWith('jwt');
    });

    it('logout dispatches to the client policy with the notice', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      await result.current.logout({ notice: 'signed-out' });

      expect(mockPolicy.logout).toHaveBeenCalledWith({ notice: 'signed-out' });
    });
  });

  describe('canRecover conjunction', () => {
    it('is true only when the policy supports recovery AND the session can refresh', async () => {
      mockPolicy.supportsSessionRecovery = true;
      const { result } = setup({
        authResponse: {
          ...AUTH_ENABLED,
          auth: { isValidToken: true, canRefresh: true },
        },
      });

      await waitFor(() => {
        expect(result.current.canRecover).toBe(true);
      });
    });

    it('is false for a refresh-less session on a recovery-capable policy', async () => {
      mockPolicy.supportsSessionRecovery = true;
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(result.current.canRecover).toBe(false);
    });

    it('is false for a refreshable session on a policy without recovery', async () => {
      mockPolicy.supportsSessionRecovery = false;
      const { result } = setup({
        authResponse: {
          ...AUTH_ENABLED,
          auth: { isValidToken: true, canRefresh: true },
        },
      });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(result.current.canRecover).toBe(false);
    });
  });

  describe('recoverSession', () => {
    it('funnels through the single recovery entry point', async () => {
      mockHandleApiUnauthorized.mockResolvedValue({ kind: 'recovered' });
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      await act(async () => {
        await result.current.recoverSession('/domains/foo');
      });

      expect(mockHandleApiUnauthorized).toHaveBeenCalledTimes(1);
      expect(mockHandleApiUnauthorized).toHaveBeenCalledWith({
        returnTo: '/domains/foo',
        notice: 'session-expired',
      });
    });
  });

  describe('me query', () => {
    it('fetches me once and never queries a divergent auth-user endpoint', async () => {
      const calls = { me: 0, user: 0 };
      const onRequest = (args: { request: Request }) => {
        if (args.request.url.endsWith('/api/auth/me')) calls.me += 1;
        if (args.request.url.endsWith('/api/auth/user')) calls.user += 1;
      };
      server.events.on('request:start', onRequest);
      try {
        const { result } = setup({ authResponse: AUTH_ENABLED });

        await waitFor(() => {
          expect(result.current.isValidToken).toBe(true);
        });

        expect(calls.me).toBe(1);
        expect(calls.user).toBe(0);
      } finally {
        server.events.removeListener('request:start', onRequest);
      }
    });
  });
});

function setup({ authResponse }: { authResponse: AuthMeResponse }) {
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
