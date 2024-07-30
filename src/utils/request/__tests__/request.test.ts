import request from '../request';
import { RequestError } from '../request-error';

describe('request on browser env', () => {
  afterEach(() => {
    const mockedFetch = global.fetch as jest.MockedFunction<
      typeof global.fetch
    >;
    mockedFetch.mockClear();
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
    expect(fetch).toHaveBeenCalledWith(url, { cache: 'no-cache', ...options });
  });

  it('should call fetch with relative URL on client and no-cache option', async () => {
    const url = '/api/data';
    const options = { method: 'POST' };
    await request(url, options);
    expect(fetch).toHaveBeenCalledWith(url, { cache: 'no-cache', ...options });
  });

  it('should return error if request.ok is false', async () => {
    // mock fetch failure
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: async () => ({ error: 'test error' }),
        status: 500,
      } as Response)
    );
    const url = '/api/data';
    const options = { method: 'POST' };
    expect(request(url, options)).rejects.toThrow(
      new RequestError('test error', 400)
    );
  });
});
