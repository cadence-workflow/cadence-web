import { HttpResponse, type StrictResponse } from 'msw';

import { waitFor } from '@/test-utils/rtl';

import mswMockEndpoints from '@/test-utils/msw-mock-handlers/helper/msw-mock-endpoints';
import {
  AUTH_LOOP_MARKER_PARAM,
  AUTH_NOTICE_PARAM,
} from '@/utils/auth/auth.constants';

import { AUTH_RECOVERY_LOCK_NAME } from '../auth-recovery.constants';
import { type HandleApiUnauthorizedContext } from '../handle-api-unauthorized.types';

const CTX: HandleApiUnauthorizedContext = {
  returnTo: '/domains/foo',
  notice: 'session-expired',
};

const ME_INVALID = { auth: { isValidToken: false } };
const RECOVERED = { kind: 'recovered', expiresAtMs: 1234 };

describe('handleApiUnauthorized', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'locks');
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

    const { handleApiUnauthorized } = await loadModule();
    const result = await handleApiUnauthorized(CTX);

    expect(result).toEqual(RECOVERED);
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

    const { handleApiUnauthorized } = await loadModule();
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

    const { handleApiUnauthorized } = await loadModule();
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

    const { handleApiUnauthorized } = await loadModule();
    const [first, second] = await Promise.all([
      handleApiUnauthorized(CTX),
      handleApiUnauthorized(CTX),
    ]);

    expect(first).toEqual(RECOVERED);
    expect(second).toEqual(RECOVERED);
    expect(recoverResolver).toHaveBeenCalledTimes(1);
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

    const { handleApiUnauthorized, queryClient } = await loadModule();
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

    try {
      const { handleApiUnauthorized } = await loadModule();
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
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: originalLocation,
      });
    }
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

    const { handleApiUnauthorized } = await loadModule();
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

    const { handleApiUnauthorized } = await loadModule();
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

    const { handleApiUnauthorized } = await loadModule();
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

    const { handleApiUnauthorized } = await loadModule();
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

    const { handleApiUnauthorized, queryClient } = await loadModule();
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

    const { handleApiUnauthorized } = await loadModule();
    const result = await handleApiUnauthorized(CTX);

    expect(result).toEqual(RECOVERED);
    expect(recoverResolver).toHaveBeenCalledTimes(1);
  });
});

/**
 * recoveryInFlight is module state: each test loads a fresh module registry
 * so dedup never leaks between tests. The query client is read from the same
 * fresh registry so invalidation spies see the module-under-test's instance.
 */
async function loadModule() {
  jest.resetModules();
  const { handleApiUnauthorized } = await import('../handle-api-unauthorized');
  const { getQueryClient } = await import('@/utils/query-client/query-client');
  return { handleApiUnauthorized, queryClient: getQueryClient() };
}
