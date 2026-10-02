import { HttpResponse, type StrictResponse } from 'msw';

import { waitFor } from '@/test-utils/rtl';

import mswMockEndpoints from '@/test-utils/msw-mock-handlers/helper/msw-mock-endpoints';
import {
  AUTH_LOOP_MARKER_PARAM,
  AUTH_NOTICE_PARAM,
  AUTH_UNAVAILABLE_PATH,
} from '@/utils/auth/auth.constants';
import { type AuthClientPolicy } from '@/utils/auth/auth.types';

import { AUTH_RECOVERY_LOCK_NAME } from '../auth-recovery.constants';
import { type HandleApiUnauthorizedContext } from '../handle-api-unauthorized.types';

const CTX: HandleApiUnauthorizedContext = {
  returnTo: '/domains/foo',
  notice: 'session-expired',
};

const ME_INVALID = { auth: { isValidToken: false } };
const RECOVERED = { kind: 'recovered', expiresAtMs: 1234 };

const realLocation = window.location;

describe('handleApiUnauthorized', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'locks');
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: realLocation,
    });
  });

  it('serializes recovery through the Web Locks API and posts the context to the recover route', async () => {
    const order: Array<string> = [];
    const locksRequest = jest.fn(
      async (_name: string, callback: () => Promise<unknown>) => {
        order.push('lock-acquired');
        const result = await callback();
        order.push('lock-released');
        return result;
      }
    );
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: { request: locksRequest },
    });

    let postedBody: unknown;
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: async ({ request }) => {
          order.push('recover-post');
          postedBody = await request.json();
          return HttpResponse.json(RECOVERED);
        },
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const result = await handleApiUnauthorized(CTX);

    expect(result).toEqual(RECOVERED);
    // The lock name is a fixed per-origin constant: one cookie jar per
    // browser profile means one session, and a session-derived name would
    // leak the session identifier via navigator.locks.query().
    expect(AUTH_RECOVERY_LOCK_NAME).toBe('cadence-auth-recover');
    expect(locksRequest).toHaveBeenCalledTimes(1);
    expect(locksRequest).toHaveBeenCalledWith(
      AUTH_RECOVERY_LOCK_NAME,
      expect.any(Function)
    );
    // The recover POST runs inside the lock callback.
    expect(order).toEqual(['lock-acquired', 'recover-post', 'lock-released']);
    expect(postedBody).toEqual({
      returnTo: CTX.returnTo,
      notice: CTX.notice,
    });
  });

  it('falls back to a direct call when Web Locks are unavailable', async () => {
    Reflect.deleteProperty(navigator, 'locks');
    const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
    mswMockEndpoints([
      {
        httpMethod: 'GET',
        path: '/api/auth/me',
        httpResolver: async () => HttpResponse.json(null, { status: 401 }),
      },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: recoverResolver,
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const result = await handleApiUnauthorized(CTX);

    expect(result).toEqual(RECOVERED);
    expect(recoverResolver).toHaveBeenCalledTimes(1);
  });

  it('skips the recover route when the re-check shows a sibling tab already recovered', async () => {
    const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
    mswMockEndpoints([
      {
        httpMethod: 'GET',
        path: '/api/auth/me',
        jsonResponse: { auth: { isValidToken: true, expiresAtMs: 999 } },
      },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: recoverResolver,
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const result = await handleApiUnauthorized(CTX);

    expect(result).toEqual({ kind: 'recovered', expiresAtMs: 999 });
    expect(recoverResolver).not.toHaveBeenCalled();
  });

  it('dedupes concurrent 401s in one tab into a single recovery', async () => {
    const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: recoverResolver,
      },
    ]);

    const { handleApiUnauthorized, queryClient, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [first, second] = await Promise.all([
      handleApiUnauthorized(CTX),
      handleApiUnauthorized(CTX),
    ]);

    expect(first).toEqual(RECOVERED);
    expect(second).toEqual(RECOVERED);
    expect(recoverResolver).toHaveBeenCalledTimes(1);
    // Side effects run once per recovery, not once per deduped caller —
    // invalidateQueries cancels in-flight refetches, so per-caller
    // invalidation would cascade cancelled auth-me refetches in a 401 burst.
    expect(invalidateSpy).toHaveBeenCalledTimes(2);
  });

  it('invalidates the post-recovery query set on recovered', async () => {
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        jsonResponse: RECOVERED,
      },
    ]);

    const { handleApiUnauthorized, queryClient, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    await handleApiUnauthorized(CTX);

    expect(invalidateSpy).toHaveBeenCalledTimes(2);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['auth-me'] });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dynamic_config'],
    });
  });

  it('navigates after the lock callback returned on redirect, then suspends', async () => {
    let lockCallbackReturned = false;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: async (_name: string, callback: () => Promise<unknown>) => {
          const result = await callback();
          lockCallbackReturned = true;
          return result;
        },
      },
    });

    const mockAssign = mockLocationAssign();

    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        jsonResponse: {
          kind: 'redirect',
          returnTo: `/domains/foo?${AUTH_LOOP_MARKER_PARAM}=1&x=1`,
          notice: 'session-expired',
        },
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    let settled = false;
    const promise = handleApiUnauthorized(CTX);
    promise.then(
      () => {
        settled = true;
      },
      () => {
        settled = true;
      }
    );

    await waitFor(() => expect(mockAssign).toHaveBeenCalledTimes(1));
    // The loop marker is dropped and the notice rides as authNotice.
    expect(mockAssign).toHaveBeenCalledWith(
      `/domains/foo?x=1&${AUTH_NOTICE_PARAM}=session-expired`
    );
    // Navigation happens only after the lock callback returned, so a
    // suspended caller never holds the cross-tab lock.
    expect(lockCallbackReturned).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(settled).toBe(false);
  });

  it('returns undefined when the recover route rejects', async () => {
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: async () => HttpResponse.json(null, { status: 500 }),
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    await expect(handleApiUnauthorized(CTX)).resolves.toBeUndefined();
  });

  it('declines recovery when the recover fetch fails at the transport level', async () => {
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: async () => HttpResponse.error() as StrictResponse<never>,
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    // The caller's original 401 stands; no raw TypeError escapes.
    await expect(handleApiUnauthorized(CTX)).resolves.toBeUndefined();
  });

  it('declines recovery when the recover route returns an unparseable body', async () => {
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: async () => HttpResponse.text('not-json'),
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    await expect(handleApiUnauthorized(CTX)).resolves.toBeUndefined();
  });

  it('declines recovery when the lock manager rejects', async () => {
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: jest.fn(async () => {
          throw new DOMException('Aborted', 'AbortError');
        }),
      },
    });
    const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
    mswMockEndpoints([
      { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: recoverResolver,
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    await expect(handleApiUnauthorized(CTX)).resolves.toBeUndefined();
    expect(recoverResolver).not.toHaveBeenCalled();
  });

  it('does not deadlock when a refetch 401 re-enters recovery during invalidation', async () => {
    const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
    mswMockEndpoints([
      {
        httpMethod: 'GET',
        path: '/api/auth/me',
        jsonResponse: ME_INVALID,
        mockOnce: false,
      },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: recoverResolver,
        mockOnce: false,
      },
    ]);

    const { handleApiUnauthorized, queryClient, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const originalInvalidate = queryClient.invalidateQueries.bind(queryClient);
    jest
      .spyOn(queryClient, 'invalidateQueries')
      // A refetch kicked off by invalidateQueries can 401; its recovery must
      // settle before the invalidation completes. Joining the in-flight
      // recovery here is the deadlock this test guards against.
      .mockImplementationOnce(async (filters) => {
        await handleApiUnauthorized(CTX);
        return originalInvalidate(filters);
      });

    await expect(handleApiUnauthorized(CTX)).resolves.toEqual(RECOVERED);
    // The re-entrant call ran its own recovery instead of joining the
    // in-flight one (whose continuation it was blocking).
    expect(recoverResolver).toHaveBeenCalledTimes(2);
  });

  it('falls through to the recover route when the re-check fetch fails', async () => {
    const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
    mswMockEndpoints([
      {
        httpMethod: 'GET',
        path: '/api/auth/me',
        // HttpResponse.error() returns a plain Response (network error).
        httpResolver: async () => HttpResponse.error() as StrictResponse<never>,
      },
      {
        httpMethod: 'POST',
        path: '/api/auth/recover',
        httpResolver: recoverResolver,
      },
    ]);

    const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
      await loadModule();
    setCachedAuthStrategyConfig('jwt');
    const result = await handleApiUnauthorized(CTX);

    expect(result).toEqual(RECOVERED);
    expect(recoverResolver).toHaveBeenCalledTimes(1);
  });

  describe('policy gate', () => {
    it('returns undefined when the strategy cannot be resolved', async () => {
      // Cache empty and the fallback me fetch fails.
      const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
      mswMockEndpoints([
        {
          httpMethod: 'GET',
          path: '/api/auth/me',
          httpResolver: async () => HttpResponse.json(null, { status: 500 }),
        },
        {
          httpMethod: 'POST',
          path: '/api/auth/recover',
          httpResolver: recoverResolver,
        },
      ]);

      const { handleApiUnauthorized } = await loadModule();
      const result = await handleApiUnauthorized(CTX);

      expect(result).toBeUndefined();
      expect(recoverResolver).not.toHaveBeenCalled();
    });

    it('resolves the strategy from me when the cache is empty', async () => {
      const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
      mswMockEndpoints([
        {
          httpMethod: 'GET',
          path: '/api/auth/me',
          mockOnce: false,
          jsonResponse: {
            authEnabled: true,
            authStrategy: 'jwt',
            auth: { isValidToken: false },
            isAdmin: false,
          },
        },
        {
          httpMethod: 'POST',
          path: '/api/auth/recover',
          httpResolver: recoverResolver,
        },
      ]);

      const { handleApiUnauthorized } = await loadModule();
      const result = await handleApiUnauthorized(CTX);

      expect(result).toEqual(RECOVERED);
      expect(recoverResolver).toHaveBeenCalledTimes(1);
    });

    it('enters recovery when the policy accepts the 401 response', async () => {
      const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
      mswMockEndpoints([
        { httpMethod: 'GET', path: '/api/auth/me', jsonResponse: ME_INVALID },
        {
          httpMethod: 'POST',
          path: '/api/auth/recover',
          httpResolver: recoverResolver,
        },
      ]);

      const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
        await loadModule();
      setCachedAuthStrategyConfig('jwt');
      const result = await handleApiUnauthorized({
        ...CTX,
        response: new Response(null, { status: 401 }),
      });

      expect(result).toEqual(RECOVERED);
      expect(recoverResolver).toHaveBeenCalledTimes(1);
    });

    it('sends the 401 to the status page and suspends for a policy with the unavailable remedy', async () => {
      // No real policy declares the unavailable remedy yet — the remedy
      // machinery is strategy-blind, so a fixture policy pins it.
      const fixturePolicy: AuthClientPolicy = {
        supportsSessionRecovery: false,
        unauthenticatedRemedy: 'unavailable',
        login: jest.fn(),
        logout: jest.fn().mockResolvedValue(undefined),
        onUnauthorized: () => false,
      };
      const meResolver = jest.fn(async () => HttpResponse.json(ME_INVALID));
      const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
      mswMockEndpoints([
        { httpMethod: 'GET', path: '/api/auth/me', httpResolver: meResolver },
        {
          httpMethod: 'POST',
          path: '/api/auth/recover',
          httpResolver: recoverResolver,
        },
      ]);
      const mockAssign = mockLocationAssign();

      const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
        await loadModule({ clientPolicy: fixturePolicy });
      setCachedAuthStrategyConfig('jwt');

      let settled = false;
      void handleApiUnauthorized({
        ...CTX,
        response: new Response(null, { status: 401 }),
      }).then(
        () => {
          settled = true;
        },
        () => {
          settled = true;
        }
      );

      await waitFor(() =>
        expect(mockAssign).toHaveBeenCalledWith(AUTH_UNAVAILABLE_PATH)
      );
      expect(recoverResolver).not.toHaveBeenCalled();
      expect(meResolver).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(settled).toBe(false);
    });

    it('returns undefined for a policy that opts out with the login remedy (disabled)', async () => {
      const recoverResolver = jest.fn(() => HttpResponse.json(RECOVERED));
      mswMockEndpoints([
        {
          httpMethod: 'POST',
          path: '/api/auth/recover',
          httpResolver: recoverResolver,
        },
      ]);
      const mockAssign = mockLocationAssign();

      const { handleApiUnauthorized, setCachedAuthStrategyConfig } =
        await loadModule();
      setCachedAuthStrategyConfig('disabled');

      const result = await handleApiUnauthorized({
        ...CTX,
        response: new Response(null, { status: 401 }),
      });

      expect(result).toBeUndefined();
      expect(mockAssign).not.toHaveBeenCalled();
      expect(recoverResolver).not.toHaveBeenCalled();
    });
  });
});

/**
 * recoveryInFlight and the strategy cache are module state: each test loads a
 * fresh module registry so neither leaks between tests. The query client is
 * read from the same fresh registry so invalidation spies see the
 * module-under-test's instance.
 */
async function loadModule(options?: { clientPolicy?: AuthClientPolicy }) {
  jest.resetModules();
  if (options?.clientPolicy) {
    const policy = options.clientPolicy;
    jest.doMock('@/utils/auth/strategies/get-auth-client-policy', () => ({
      __esModule: true,
      default: jest.fn(() => policy),
    }));
  } else {
    jest.dontMock('@/utils/auth/strategies/get-auth-client-policy');
  }
  const { handleApiUnauthorized } = await import('../handle-api-unauthorized');
  const { getQueryClient } = await import('@/utils/query-client/query-client');
  const { setCachedAuthStrategyConfig } = await import(
    '@/utils/auth/helpers/auth-strategy-config-cache'
  );
  return {
    handleApiUnauthorized,
    queryClient: getQueryClient(),
    setCachedAuthStrategyConfig,
  };
}

function mockLocationAssign() {
  const originalLocation = window.location;
  const mockAssign = jest.fn();
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {
      ...originalLocation,
      origin: originalLocation.origin,
      assign: mockAssign,
    },
  });
  return mockAssign;
}
