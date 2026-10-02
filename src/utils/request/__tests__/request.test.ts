import { headers } from 'next/headers';

import { handleApiUnauthorized } from '@/utils/auth/recovery/handle-api-unauthorized';

import request from '../request';
import { RequestError } from '../request-error';

jest.mock('next/headers', () => ({
  headers: jest.fn().mockReturnValue({
    entries: jest.fn().mockReturnValue([
      ['x-user-id', 'user123'],
      ['authorization', 'Bearer user-token'],
    ]),
  }),
}));

jest.mock('@/utils/auth/recovery/handle-api-unauthorized', () => ({
  handleApiUnauthorized: jest.fn(),
}));

const mockHandleApiUnauthorized = handleApiUnauthorized as jest.MockedFunction<
  typeof handleApiUnauthorized
>;

const unauthorizedResponse = () =>
  ({
    ok: false,
    status: 401,
    json: async () => ({ message: 'unauthorized' }),
  }) as Response;

const okResponse = () => ({ ok: true, status: 200 }) as Response;

describe('request on browser env', () => {
  afterEach(() => {
    const mockedFetch = global.fetch as jest.MockedFunction<
      typeof global.fetch
    >;
    mockedFetch.mockClear();
    mockHandleApiUnauthorized.mockReset();
  });
  beforeEach(() => {
    // mock within beforeEach as jest.pollyfills.js replaces the implementation of fetch
    // if we mocked it at the top of the file
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response)
    );
  });
  it('should call fetch with absolute URL and no-cache option', async () => {
    const url = 'http://example.com';
    const options = { method: 'GET' };
    await request(url, options);
    expect(fetch).toHaveBeenCalledWith(url, {
      cache: 'no-cache',
      headers: {},
      ...options,
    });
  });

  it('should call fetch with relative URL on client and no-cache option', async () => {
    const url = '/api/data';
    const options = { method: 'POST' };
    await request(url, options);
    expect(fetch).toHaveBeenCalledWith(url, {
      cache: 'no-cache',
      headers: {},
      ...options,
    });
  });

  it('should not call headers() or use user headers in client environment', async () => {
    const url = '/api/data';
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    };

    await request(url, options);

    // Verify headers() was never called in browser environment
    expect(headers).not.toHaveBeenCalled();

    // Verify only the provided headers are used, not user headers
    expect(fetch).toHaveBeenCalledWith(url, {
      cache: 'no-cache',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  });

  it('should return error if request.ok is false', async () => {
    // mock fetch failure
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: async () => ({ message: 'test error' }),
        status: 500,
      } as Response)
    );
    const url = '/api/data';
    const options = { method: 'POST' };
    expect(request(url, options)).rejects.toThrow(
      new RequestError('test error', '/api/data', 400)
    );
  });

  describe('401 recovery pipeline', () => {
    it('enters the single recovery entry point on 401 and retries once on recovered', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce(unauthorizedResponse())
        .mockResolvedValueOnce(okResponse());
      mockHandleApiUnauthorized.mockResolvedValue({ kind: 'recovered' });

      const result = await request('/api/data', { method: 'GET' });

      expect(result.ok).toBe(true);
      expect(mockHandleApiUnauthorized).toHaveBeenCalledTimes(1);
      expect(mockHandleApiUnauthorized).toHaveBeenCalledWith({
        returnTo: `${window.location.pathname}${window.location.search}`,
        notice: 'session-expired',
        response: expect.objectContaining({ status: 401 }),
      });
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('throws after exactly one retry when the retried request 401s again (retry-once bound)', async () => {
      global.fetch = jest.fn().mockResolvedValue(unauthorizedResponse());
      mockHandleApiUnauthorized.mockResolvedValue({ kind: 'recovered' });

      await expect(request('/api/data', { method: 'GET' })).rejects.toThrow(
        new RequestError('unauthorized', '/api/data', 401)
      );
      // One recover call, two fetches: the second 401 is never recovered.
      expect(mockHandleApiUnauthorized).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('throws the original 401 when recovery is declined', async () => {
      global.fetch = jest.fn().mockResolvedValue(unauthorizedResponse());
      mockHandleApiUnauthorized.mockResolvedValue(undefined);

      await expect(request('/api/data', { method: 'GET' })).rejects.toThrow(
        new RequestError('unauthorized', '/api/data', 401)
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('never recovers /api/auth/* 401s', async () => {
      global.fetch = jest.fn().mockResolvedValue(unauthorizedResponse());

      await expect(request('/api/auth/me')).rejects.toThrow(
        new RequestError('unauthorized', '/api/auth/me', 401)
      );
      expect(mockHandleApiUnauthorized).not.toHaveBeenCalled();
    });

    it('never recovers when skipAuthRecovery is set', async () => {
      global.fetch = jest.fn().mockResolvedValue(unauthorizedResponse());

      await expect(
        request('/api/data', { skipAuthRecovery: true })
      ).rejects.toThrow(new RequestError('unauthorized', '/api/data', 401));
      expect(mockHandleApiUnauthorized).not.toHaveBeenCalled();
    });
  });
});
