import { type Query, type QueryKey } from '@tanstack/react-query';

import { type AuthMeResponse } from '@/route-handlers/get-auth-me/get-auth-me.types';
import { type RequestError } from '@/utils/request/request-error';

import getUserInfoQueryOptions from '../get-user-info-query-options';
import {
  EXPIRED_TOKEN_RECHECK_INTERVAL_MS,
  MAX_TIMER_DELAY_MS,
} from '../use-user-info.constants';

const NOW = new Date('2026-10-10T12:00:00Z').getTime();

describe(getUserInfoQueryOptions.name, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('refetches at token expiry', () => {
    expect(
      getRefetchInterval({ isValidToken: true, expiresAtMs: NOW + 5_000 })
    ).toBe(5_000);
  });

  it('keeps rechecking when the client clock is past a still-valid expiry', () => {
    expect(
      getRefetchInterval({ isValidToken: true, expiresAtMs: NOW - 1 })
    ).toBe(EXPIRED_TOKEN_RECHECK_INTERVAL_MS);
  });

  it('caps far-off expiry at the max timer delay', () => {
    expect(
      getRefetchInterval({ isValidToken: true, expiresAtMs: NOW + 2 ** 40 })
    ).toBe(MAX_TIMER_DELAY_MS);
  });

  it('does not poll without a valid expiring token', () => {
    expect(getRefetchInterval({ isValidToken: false })).toBe(false);
    expect(getRefetchInterval({ isValidToken: true })).toBe(false);
  });
});

function getRefetchInterval(auth: AuthMeResponse['auth']) {
  const { refetchInterval } = getUserInfoQueryOptions();
  if (typeof refetchInterval !== 'function') {
    throw new Error('Expected refetchInterval to be a function');
  }
  return refetchInterval({
    state: {
      data: { authEnabled: true, authStrategy: 'jwt', auth, isAdmin: false },
    },
  } as Query<AuthMeResponse, RequestError, AuthMeResponse, QueryKey>);
}
