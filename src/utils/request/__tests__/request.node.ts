import { headers } from 'next/headers';

import { handleApiUnauthorized } from '@/utils/auth/recovery/handle-api-unauthorized';
import getConfigValue from '@/utils/config/get-config-value';

import request from '../request';
jest.mock('@/utils/config/get-config-value');
jest.mock('next/headers', () => ({
  headers: jest.fn().mockReturnValue({
    entries: jest.fn().mockReturnValue([]),
  }),
}));

jest.mock('@/utils/auth/recovery/handle-api-unauthorized', () => ({
  handleApiUnauthorized: jest.fn(),
}));

const mockHandleApiUnauthorized = handleApiUnauthorized as jest.MockedFunction<
  typeof handleApiUnauthorized
>;

describe('request on node env', () => {
  afterEach(() => {
    const mockedFetch = global.fetch as jest.MockedFunction<
      typeof global.fetch
    >;
    mockedFetch.mockClear();
  });

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response)
    );
  });

  it('should call fetch with relative URL converted to absolute URL on server and no-cache option', async () => {
    const url = '/api/data';
    const options = { method: 'POST' };
    const port = await getConfigValue('CADENCE_WEB_PORT');
    await request(url, options);
    expect(fetch).toHaveBeenCalledWith(`http://127.0.0.1:${port}` + url, {
      cache: 'no-cache',
      headers: {},
      ...options,
    });
  });

  it('should merge user headers with call headers, with call headers taking precedence', async () => {
    const url = '/api/data';
    const mockHeaders = jest.fn().mockReturnValue({
      entries: jest.fn().mockReturnValue([
        ['x-user-id', 'user123'],
        ['authorization', 'Bearer user-token'],
      ]),
    });
    (headers as jest.MockedFunction<typeof headers>).mockReturnValue(
      mockHeaders() as any
    );

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer override-token',
      },
    };

    const port = await getConfigValue('CADENCE_WEB_PORT');
    await request(url, options);

    expect(fetch).toHaveBeenCalledWith(`http://127.0.0.1:${port}` + url, {
      cache: 'no-cache',
      headers: {
        'x-user-id': 'user123',
        authorization: 'Bearer override-token', // Call header overrides user header
        'content-type': 'application/json',
      },
      method: 'POST',
    });
  });

  it('should omit user headers when omitUserHeaders is true', async () => {
    const url = '/api/data';
    const mockHeaders = jest.fn().mockReturnValue({
      entries: jest.fn().mockReturnValue([
        ['x-user-id', 'user123'],
        ['authorization', 'Bearer user-token'],
      ]),
    });
    (headers as jest.MockedFunction<typeof headers>).mockReturnValue(
      mockHeaders() as any
    );

    const options = {
      method: 'POST',
      omitUserHeaders: true,
      headers: {
        'content-type': 'application/json',
      },
    };

    const port = await getConfigValue('CADENCE_WEB_PORT');
    await request(url, options);

    expect(fetch).toHaveBeenCalledWith(`http://127.0.0.1:${port}` + url, {
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    });
  });

  it('never enters the recovery pipeline on the server (401 throws directly)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'unauthorized' }),
    } as Response);

    await expect(request('/api/data', { method: 'GET' })).rejects.toThrow(
      'unauthorized'
    );
    expect(mockHandleApiUnauthorized).not.toHaveBeenCalled();
  });
});
