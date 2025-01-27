import getConfigValue from '@/utils/config/get-config-value';

import request from '../request';
jest.mock('@/utils/config/get-config-value');

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
      ...options,
    });
  });
});
