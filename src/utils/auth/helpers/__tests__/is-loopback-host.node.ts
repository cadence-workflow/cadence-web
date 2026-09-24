import isLoopbackHost from '../is-loopback-host';

describe(isLoopbackHost.name, () => {
  it.each([
    'localhost',
    'LOCALHOST',
    '127.0.0.1',
    '::1',
    '[::1]',
    'app.localhost',
  ])('treats %s as loopback', (host) => {
    expect(isLoopbackHost(host)).toBe(true);
  });

  it.each([
    'example.com',
    'localhost.example.com',
    // Deliberately narrow: only exact 127.0.0.1, not all of 127/8 — a wider
    // predicate would silently qualify more deployments for insecure mode.
    '127.0.0.2',
    '128.0.0.1',
    '::2',
    '',
  ])('treats %s as non-loopback', (host) => {
    expect(isLoopbackHost(host)).toBe(false);
  });
});
