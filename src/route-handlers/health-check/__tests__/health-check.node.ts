import { getHealthCheck } from '../health-check';

describe(getHealthCheck.name, () => {
  it('returns 200, an ok body, and Cache-Control no-store', async () => {
    const response = getHealthCheck();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});
