import React from 'react';

import { render } from '@/test-utils/rtl';

import useAuthLifecycle from '@/hooks/use-auth-lifecycle/use-auth-lifecycle';
import { type AuthLifecycle } from '@/hooks/use-auth-lifecycle/use-auth-lifecycle.types';

import AuthSessionWatcher from '../auth-session-watcher';

jest.mock('@/hooks/use-auth-lifecycle/use-auth-lifecycle');

const mockUseAuthLifecycle = useAuthLifecycle as jest.MockedFunction<
  typeof useAuthLifecycle
>;

describe(AuthSessionWatcher.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('expires the session when the token flips invalid in place', () => {
    const { rerender, logout, expireSession } = setup({});

    mockUseAuthLifecycle.mockReturnValue(
      buildLifecycle({ isValidToken: false, logout, expireSession })
    );
    rerender(<AuthSessionWatcher />);

    expect(expireSession).toHaveBeenCalledTimes(1);
    expect(logout).not.toHaveBeenCalled();
  });
});

function setup({ lifecycle }: { lifecycle?: Partial<AuthLifecycle> }) {
  const built = buildLifecycle(lifecycle);
  mockUseAuthLifecycle.mockReturnValue(built);
  return {
    ...render(<AuthSessionWatcher />),
    logout: built.logout as jest.Mock,
    expireSession: built.expireSession as jest.Mock,
  };
}

function buildLifecycle(overrides?: Partial<AuthLifecycle>): AuthLifecycle {
  return {
    isAuthEnabled: true,
    isValidToken: true,
    isAuthLoading: false,
    isAdmin: false,
    userName: 'alice',
    logout: jest.fn().mockResolvedValue(undefined),
    expireSession: jest.fn(),
    ...overrides,
  };
}
