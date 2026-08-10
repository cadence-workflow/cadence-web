import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import useAuthLifecycle from '../use-auth-lifecycle';

type AuthResponse = {
  authEnabled: boolean;
  auth: {
    isValidToken: boolean;
    expiresAtMs?: number;
  };
  isAdmin: boolean;
  groups: string[];
  userName?: string;
};

const AUTH_ENABLED: AuthResponse = {
  authEnabled: true,
  auth: { isValidToken: true },
  isAdmin: false,
  groups: ['reader'],
  userName: 'alice',
};

const AUTH_DISABLED: AuthResponse = {
  authEnabled: false,
  auth: { isValidToken: false },
  isAdmin: false,
  groups: [],
};

const AUTH_UNAUTHENTICATED: AuthResponse = {
  authEnabled: true,
  auth: { isValidToken: false },
  isAdmin: false,
  groups: [],
};

const AUTH_ADMIN: AuthResponse = {
  authEnabled: true,
  auth: { isValidToken: true },
  isAdmin: true,
  groups: [],
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

    it('preserves missing username for consumers to handle', async () => {
      const { result } = setup({
        authResponse: { ...AUTH_ENABLED, userName: undefined },
      });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      expect(result.current.userName).toBeUndefined();
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

  describe('saveToken', () => {
    it('calls POST /api/auth/token and returns true for valid token', async () => {
      let currentAuth: AuthResponse = AUTH_UNAUTHENTICATED;
      const { result, postTokenHandler } = setup({
        authResponse: currentAuth,
        dynamicAuthResolver: () => currentAuth,
      });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      currentAuth = AUTH_ENABLED;
      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.saveToken('header.payload.signature');
      });

      expect(postTokenHandler).toHaveBeenCalled();
      expect(isValid).toBe(true);
    });

    it('returns false when token is invalid after save', async () => {
      const { result } = setup({
        authResponse: AUTH_UNAUTHENTICATED,
      });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.saveToken('header.payload.signature');
      });

      expect(isValid).toBe(false);
    });

    it('throws when POST fails', async () => {
      const { result } = setup({
        authResponse: AUTH_UNAUTHENTICATED,
        tokenError: true,
      });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      let thrown: unknown;
      await act(async () => {
        try {
          await result.current.saveToken('header.payload.signature');
        } catch (e) {
          thrown = e;
        }
      });

      expect(thrown).toBeDefined();
    });
  });

  describe('logout', () => {
    it('calls DELETE /api/auth/token and refetches', async () => {
      const { result, postTokenHandler, deleteTokenHandler } = setup({
        authResponse: AUTH_ENABLED,
      });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(deleteTokenHandler).toHaveBeenCalled();
      expect(postTokenHandler).not.toHaveBeenCalled();
    });

    it('still refetches when DELETE fails', async () => {
      let currentAuth: AuthResponse = AUTH_ENABLED;
      const { result } = setup({
        authResponse: AUTH_ENABLED,
        dynamicAuthResolver: () => currentAuth,
        tokenError: true,
      });

      await waitFor(() => {
        expect(result.current.isValidToken).toBe(true);
      });

      currentAuth = AUTH_UNAUTHENTICATED;
      let thrown: unknown;
      await act(async () => {
        try {
          await result.current.logout();
        } catch (e) {
          thrown = e;
        }
      });

      expect(thrown).toBeDefined();
      await waitFor(() => {
        expect(result.current.isValidToken).toBe(false);
      });
    });
  });
});

function setup({
  authResponse,
  dynamicAuthResolver,
  tokenError = false,
  postTokenHandler: customPostHandler,
  deleteTokenHandler: customDeleteHandler,
}: {
  authResponse: AuthResponse;
  dynamicAuthResolver?: () => AuthResponse;
  tokenError?: boolean;
  postTokenHandler?: jest.Mock;
  deleteTokenHandler?: jest.Mock;
}) {
  const defaultHandler = () => {
    if (tokenError) {
      return HttpResponse.json(
        { message: 'Token operation failed' },
        { status: 500 }
      );
    }
    return HttpResponse.json({ ok: true });
  };

  const postTokenHandler = customPostHandler ?? jest.fn(defaultHandler);
  const deleteTokenHandler = customDeleteHandler ?? jest.fn(defaultHandler);

  const { result } = renderHook(() => useAuthLifecycle(), {
    endpointsMocks: [
      {
        path: '/api/auth/me',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: () => {
          const response = dynamicAuthResolver
            ? dynamicAuthResolver()
            : authResponse;
          return HttpResponse.json(response);
        },
      },
      {
        path: '/api/auth/token',
        httpMethod: 'POST' as const,
        mockOnce: false,
        httpResolver: postTokenHandler,
      },
      {
        path: '/api/auth/token',
        httpMethod: 'DELETE' as const,
        mockOnce: false,
        httpResolver: deleteTokenHandler,
      },
    ],
  });

  return { result, postTokenHandler, deleteTokenHandler };
}
