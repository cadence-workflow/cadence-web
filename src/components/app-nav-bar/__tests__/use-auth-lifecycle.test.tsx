import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import useAuthLifecycle from '../use-auth-lifecycle';

const mockEnqueue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: jest.fn(),
  }),
}));

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: mockReplace,
    refresh: mockRefresh,
    prefetch: jest.fn(),
  }),
  usePathname: () => '/domains/test-domain/test-cluster',
}));

type AuthResponse = {
  authEnabled: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  groups: string[];
  userName?: string;
  expiresAtMs?: number;
};

const AUTH_ENABLED: AuthResponse = {
  authEnabled: true,
  isAuthenticated: true,
  isAdmin: false,
  groups: ['reader'],
  userName: 'alice',
};

const AUTH_DISABLED: AuthResponse = {
  authEnabled: false,
  isAuthenticated: false,
  isAdmin: false,
  groups: [],
};

const AUTH_UNAUTHENTICATED: AuthResponse = {
  authEnabled: true,
  isAuthenticated: false,
  isAdmin: false,
  groups: [],
};

const AUTH_ADMIN: AuthResponse = {
  authEnabled: true,
  isAuthenticated: true,
  isAdmin: true,
  groups: [],
  userName: 'admin-user',
};

describe(useAuthLifecycle.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('derived state', () => {
    it('returns no user items when auth is disabled', async () => {
      const { result } = setup({ authResponse: AUTH_DISABLED });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(false);
      });

      expect(result.current.userItems).toBeUndefined();
      expect(result.current.username).toBeUndefined();
      expect(result.current.usernameSubtitle).toBeUndefined();
    });

    it('returns login item when auth is enabled but user is unauthenticated', async () => {
      const { result } = setup({ authResponse: AUTH_UNAUTHENTICATED });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userItems).toEqual([
        { label: 'Login with JWT', info: 'login' },
      ]);
      expect(result.current.username).toBe('Authenticate');
      expect(result.current.usernameSubtitle).toBe('Provide a Cadence JWT');
    });

    it('returns switch/logout items when authenticated', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.userItems).toEqual([
        { label: 'Switch token', info: 'login' },
        { label: 'Logout', info: 'logout' },
      ]);
      expect(result.current.username).toBe('alice');
    });

    it('shows Admin subtitle for admin users', async () => {
      const { result } = setup({ authResponse: AUTH_ADMIN });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.usernameSubtitle).toBe('Admin');
    });

    it('shows fallback username when userName is missing', async () => {
      const { result } = setup({
        authResponse: { ...AUTH_ENABLED, userName: undefined },
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.username).toBe(
        'Authenticated user (unknown username)'
      );
    });
  });

  describe('saveToken', () => {
    it('calls POST /api/auth/token and refetches auth info', async () => {
      const { result, postTokenHandler, deleteTokenHandler } = setup({
        authResponse: AUTH_UNAUTHENTICATED,
      });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      await act(async () => {
        await result.current.saveToken('header.payload.signature');
      });

      expect(postTokenHandler).toHaveBeenCalled();
      expect(deleteTokenHandler).not.toHaveBeenCalled();
      expect(mockEnqueue).toHaveBeenCalledWith(
        { message: 'Token saved' },
        expect.any(Number)
      );
    });

    it('shows error snackbar when save fails', async () => {
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
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          overrides: expect.any(Object),
        }),
        expect.any(Number)
      );
    });
  });

  describe('logout', () => {
    it('calls DELETE /api/auth/token and redirects to /domains', async () => {
      const { result, postTokenHandler, deleteTokenHandler } = setup({
        authResponse: AUTH_ENABLED,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(deleteTokenHandler).toHaveBeenCalled();
      });

      expect(postTokenHandler).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/domains');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  describe('modal state', () => {
    it('opens and closes the modal', async () => {
      const { result } = setup({ authResponse: AUTH_ENABLED });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(true);
      });

      expect(result.current.isModalOpen).toBe(false);

      act(() => {
        result.current.openModal();
      });
      expect(result.current.isModalOpen).toBe(true);

      act(() => {
        result.current.closeModal();
      });
      expect(result.current.isModalOpen).toBe(false);
    });
  });

  describe('auth transition effect', () => {
    it('shows "Signed out" snackbar on manual logout transition', async () => {
      let currentAuth = AUTH_ENABLED;
      const { result } = setup({
        authResponse: currentAuth,
        dynamicAuthResolver: () => currentAuth,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      currentAuth = AUTH_UNAUTHENTICATED;
      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      await waitFor(() => {
        expect(mockEnqueue).toHaveBeenCalledWith(
          { message: 'Signed out' },
          expect.any(Number)
        );
      });
    });

    it('shows expired snackbar when token expires via timer', async () => {
      jest.useFakeTimers({ now: 1_700_000_000_000 });

      try {
        const expiresAtMs = Date.now() + 5_000;
        let currentAuth: AuthResponse = {
          ...AUTH_ENABLED,
          expiresAtMs,
        };

        const { result } = setup({
          authResponse: currentAuth,
          dynamicAuthResolver: () => currentAuth,
        });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        currentAuth = AUTH_UNAUTHENTICATED;

        await act(async () => {
          jest.advanceTimersByTime(5_000);
        });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(false);
        });

        await waitFor(() => {
          expect(mockEnqueue).toHaveBeenCalledWith(
            expect.objectContaining({
              message: 'Session expired. Please sign in again.',
              actionMessage: 'Dismiss',
            }),
            expect.any(Number)
          );
        });
      } finally {
        jest.useRealTimers();
      }
    });

    it('redirects to /domains on auth transition', async () => {
      let currentAuth = AUTH_ENABLED;
      const { result } = setup({
        authResponse: currentAuth,
        dynamicAuthResolver: () => currentAuth,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      currentAuth = AUTH_UNAUTHENTICATED;
      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/domains');
      });
    });
  });

  describe('expiry timer', () => {
    beforeEach(() => {
      jest.useFakeTimers({ now: 1_700_000_000_000 });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('schedules logout when expiresAtMs is in the future', async () => {
      const expiresAtMs = Date.now() + 5_000;
      const deleteHandler = jest.fn(() => HttpResponse.json({ ok: true }));

      const { result } = setup({
        authResponse: { ...AUTH_ENABLED, expiresAtMs },
        deleteTokenHandler: deleteHandler,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      deleteHandler.mockClear();

      await act(async () => {
        jest.advanceTimersByTime(5_000);
        await waitFor(() => {
          expect(deleteHandler).toHaveBeenCalled();
        });
      });

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
        expect(mockReplace).toHaveBeenCalledWith('/domains');
      });
    });

    it('does not schedule logout when auth is disabled', async () => {
      const expiresAtMs = Date.now() + 5_000;
      const deleteHandler = jest.fn(() => HttpResponse.json({ ok: true }));

      const { result } = setup({
        authResponse: { ...AUTH_DISABLED, expiresAtMs },
        deleteTokenHandler: deleteHandler,
      });

      await waitFor(() => {
        expect(result.current.isAuthEnabled).toBe(false);
      });

      deleteHandler.mockClear();

      await act(async () => {
        jest.advanceTimersByTime(5_000);
      });

      expect(deleteHandler).not.toHaveBeenCalled();
    });

    it('does not schedule logout when expiresAtMs is absent', async () => {
      const deleteHandler = jest.fn(() => HttpResponse.json({ ok: true }));

      const { result } = setup({
        authResponse: { ...AUTH_ENABLED, expiresAtMs: undefined },
        deleteTokenHandler: deleteHandler,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      deleteHandler.mockClear();

      await act(async () => {
        jest.advanceTimersByTime(60_000);
      });

      expect(deleteHandler).not.toHaveBeenCalled();
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
