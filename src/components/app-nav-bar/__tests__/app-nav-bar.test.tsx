import React from 'react';

import { act, render, screen, userEvent } from '@/test-utils/rtl';

import AppNavBar from '../app-nav-bar';
import useAuthLifecycle from '../hooks/use-auth-lifecycle';
import { type AuthLifecycle } from '../hooks/use-auth-lifecycle.types';

jest.mock('../hooks/use-auth-lifecycle');

const mockUseAuthLifecycle = useAuthLifecycle as jest.MockedFunction<
  typeof useAuthLifecycle
>;

const NOW = new Date('2026-09-23T12:00:00Z').getTime();

describe(AppNavBar.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the user avatar for a valid session', () => {
    setup({ lifecycle: { userName: 'alice', isAdmin: true } });

    expect(screen.getByLabelText('alice')).toBeInTheDocument();
  });

  it('renders no user menu when auth is disabled', () => {
    setup({ lifecycle: { isAuthEnabled: false, isValidToken: false } });

    expect(screen.queryByText('Authenticate')).not.toBeInTheDocument();
    expect(screen.queryByText('Log in')).not.toBeInTheDocument();
  });

  it('dispatches login with the current path from the user menu, without opening a modal', async () => {
    const user = userEvent.setup();
    const login = jest.fn();
    setup({ lifecycle: { isValidToken: false, login } });

    await user.click(screen.getByLabelText('Authenticate'));
    await user.click(await screen.findByText('Log in'));

    expect(login).toHaveBeenCalledWith(
      `${window.location.pathname}${window.location.search}`
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dispatches logout with the signed-out notice from the user menu', async () => {
    const user = userEvent.setup();
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({ lifecycle: { logout } });

    await user.click(screen.getByLabelText('alice'));
    await user.click(await screen.findByText('Log out'));

    expect(logout).toHaveBeenCalledWith({ notice: 'signed-out' });
  });

  it('logs out with the session-expired notice at token expiry', async () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({
      lifecycle: { expiresAtMs: NOW + 30_000, logout },
      fakeTimers: true,
    });

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(logout).toHaveBeenCalledWith({ notice: 'session-expired' });
  });

  it('logs out with the session-expired notice when the token flips invalid in place', () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    const { rerender } = setup({ lifecycle: { logout } });

    mockUseAuthLifecycle.mockReturnValue(
      buildLifecycle({ isValidToken: false, logout })
    );
    rerender(<AppNavBar />);

    expect(logout).toHaveBeenCalledWith({ notice: 'session-expired' });
  });
});

function setup({
  lifecycle,
  fakeTimers,
}: {
  lifecycle?: Partial<AuthLifecycle>;
  fakeTimers?: boolean;
}) {
  if (fakeTimers) {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  }
  mockUseAuthLifecycle.mockReturnValue(buildLifecycle(lifecycle));
  return render(<AppNavBar />);
}

function buildLifecycle(overrides?: Partial<AuthLifecycle>): AuthLifecycle {
  return {
    isAuthEnabled: true,
    isValidToken: true,
    isAuthLoading: false,
    isAdmin: false,
    userName: 'alice',
    expiresAtMs: undefined,
    labels: { login: 'Log in', logout: 'Log out' },
    login: jest.fn(),
    logout: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}
