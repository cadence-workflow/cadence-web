import { NextRequest } from 'next/server';

import {
  type AuthRecovery,
  type ResolvedAuthServerRegistryEntry,
} from '@/utils/auth/auth.types';
import getActiveAuthServerEntry from '@/utils/auth/strategies/get-active-auth-server-entry';

import { POST } from '../route';

jest.mock('@/utils/auth/strategies/get-active-auth-server-entry', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGetActiveAuthServerEntry = jest.mocked(getActiveAuthServerEntry);

const mockRecoverSession = jest.fn<Promise<AuthRecovery>, unknown[]>();

const REGISTRY_ENTRY: ResolvedAuthServerRegistryEntry = {
  policy: {
    recoverSession: mockRecoverSession,
  } as unknown as ResolvedAuthServerRegistryEntry['policy'],
  cookieNames: { exact: ['cadence-authorization'], prefixes: [] },
};

describe('POST /api/auth/recover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActiveAuthServerEntry.mockResolvedValue(REGISTRY_ENTRY);
    mockRecoverSession.mockResolvedValue({
      result: { kind: 'recovered', expiresAtMs: 1234 },
    });
  });

  it('rejects cross-origin requests (403)', async () => {
    const response = await POST(
      buildRequest({ origin: 'https://evil.example' })
    );

    expect(response.status).toBe(403);
    expect(mockRecoverSession).not.toHaveBeenCalled();
  });

  it('rejects non-JSON bodies (400)', async () => {
    const response = await POST(buildRequest({ contentType: 'text/plain' }));

    expect(response.status).toBe(400);
    expect(mockRecoverSession).not.toHaveBeenCalled();
  });

  it('dispatches to the active policy and returns the recovery result', async () => {
    const response = await POST(
      buildRequest({
        body: { returnTo: '/domains/foo', notice: 'session-expired' },
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      kind: 'recovered',
      expiresAtMs: 1234,
    });
    expect(mockRecoverSession).toHaveBeenCalledWith(
      expect.objectContaining({ cookies: expect.anything() }),
      { returnTo: '/domains/foo', notice: 'session-expired' }
    );
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('replays cookie mutations onto the response', async () => {
    mockRecoverSession.mockResolvedValue({
      result: {
        kind: 'redirect',
        returnTo: '/domains',
        notice: 'session-expired',
      },
      cookieMutations: [{ clear: { name: 'cadence-authorization' } }],
    });

    const response = await POST(buildRequest({}));

    expect(response.status).toBe(200);
    const setCookie = response.headers.getSetCookie().join(';');
    expect(setCookie).toContain('cadence-authorization=');
    expect(setCookie).toContain('Max-Age=0');
  });

  it('substitutes the redirect outcome and replays cleanupMutations when the write set is over budget', async () => {
    mockRecoverSession.mockResolvedValue({
      result: { kind: 'recovered', expiresAtMs: 1234 },
      cookieMutations: [
        {
          set: {
            name: 'cadence-authorization',
            value: 'x'.repeat(5000),
          },
        },
      ],
      cleanupMutations: [{ clear: { name: 'cadence-authorization' } }],
    });

    const response = await POST(
      buildRequest({ body: { returnTo: '/domains/foo' } })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      kind: 'redirect',
      returnTo: '/domains/foo',
      notice: 'session-expired',
    });
    // The oversized cookie is dropped and the cleanup clear is written.
    const setCookie = response.headers.getSetCookie().join(';');
    expect(setCookie).toContain('cadence-authorization=');
    expect(setCookie).not.toContain('xxx');
    expect(setCookie).toContain('Max-Age=0');
  });

  it('returns 500 when the policy throws', async () => {
    mockRecoverSession.mockRejectedValue(new Error('grant failed'));

    const response = await POST(buildRequest({}));

    expect(response.status).toBe(500);
  });

  it('tolerates an unparseable JSON body by using an empty context', async () => {
    const request = new NextRequest('http://localhost/api/auth/recover', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockRecoverSession).toHaveBeenCalledWith(expect.anything(), {
      returnTo: undefined,
      notice: undefined,
    });
  });
});

function buildRequest(options: {
  body?: unknown;
  contentType?: string;
  origin?: string;
}) {
  const headers = new Headers({
    'content-type': options.contentType ?? 'application/json',
  });
  // Same-origin by default; pass origin to override.
  if (options.origin !== undefined) {
    headers.set('origin', options.origin);
  }
  return new NextRequest('http://localhost/api/auth/recover', {
    method: 'POST',
    headers,
    body: JSON.stringify(options.body ?? {}),
  });
}
