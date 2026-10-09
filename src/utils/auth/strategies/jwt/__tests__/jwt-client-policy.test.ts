import jwtClientPolicy from '../jwt-client-policy';

describe('jwtClientPolicy', () => {
  const originalLocation = window.location;
  const mockAssign = jest.fn();
  const mockFetch = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...originalLocation, assign: mockAssign },
    });
    global.fetch = mockFetch.mockResolvedValue({ ok: true });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  it('declares no silent recovery and the login remedy', () => {
    expect(jwtClientPolicy.supportsSessionRecovery).toBe(false);
    expect(jwtClientPolicy.unauthenticatedRemedy).toBe('login');
  });

  it('login navigates to the login page with a sanitized returnTo', () => {
    jwtClientPolicy.login('/domains/foo');

    expect(mockAssign).toHaveBeenCalledWith(
      `/login?returnTo=${encodeURIComponent('/domains/foo')}`
    );
  });

  it('login sanitizes external returnTo values', () => {
    jwtClientPolicy.login('//evil.test');

    expect(mockAssign).toHaveBeenCalledWith(
      `/login?returnTo=${encodeURIComponent('/')}`
    );
  });

  it('logout deletes the token cookie and navigates with the notice', async () => {
    await jwtClientPolicy.logout({ notice: 'session-expired' });

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/token', {
      method: 'DELETE',
      cache: 'no-store',
    });
    expect(mockAssign).toHaveBeenCalledWith(
      `/login?notice=session-expired&returnTo=${encodeURIComponent('/')}`
    );
  });

  it('logout does not navigate when the delete request fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network failure'));

    await expect(jwtClientPolicy.logout()).rejects.toThrow('network failure');
    expect(mockAssign).not.toHaveBeenCalled();
  });

  it('logout does not navigate when the delete response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(jwtClientPolicy.logout()).rejects.toThrow(
      'Failed to clear session'
    );
    expect(mockAssign).not.toHaveBeenCalled();
  });

  it('allows the recovery pipeline to attempt recovery', () => {
    expect(jwtClientPolicy.onUnauthorized({} as Response)).toBe(true);
  });
});
