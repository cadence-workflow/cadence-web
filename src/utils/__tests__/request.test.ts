import request from '../request';

global.fetch = jest.fn();

const mockedFetch = global.fetch as jest.MockedFunction<typeof global.fetch>;

describe('request', () => {
  afterEach(() => {
    mockedFetch.mockClear();
  });

  it('should call fetch with absolute URL and no-cache option', async () => {
    const url = 'http://example.com';
    const options = { method: 'GET' };
    await request(url, options);
    expect(fetch).toHaveBeenCalledWith(url, { cache: 'no-cache', ...options });
  });

  it('should call fetch with relative URL on client and no-cache option', async () => {
    const url = '/api/data';
    const options = { method: 'POST' };
    await request(url, options);
    expect(fetch).toHaveBeenCalledWith(url, { cache: 'no-cache', ...options });
  });
  // TODO: @assem.hafez add test for server, currently the testing environment is browser
});
