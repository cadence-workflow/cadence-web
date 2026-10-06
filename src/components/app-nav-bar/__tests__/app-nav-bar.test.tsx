import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import AppNavBar from '../app-nav-bar';
import useAuthLifecycle from '../hooks/use-auth-lifecycle';
import { type AuthLifecycle } from '../hooks/use-auth-lifecycle.types';

jest.mock('../hooks/use-auth-lifecycle');

const mockEnqueue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: jest.fn(),
  }),
}));

const mockUseAuthLifecycle = useAuthLifecycle as jest.MockedFunction<
  typeof useAuthLifecycle
>;

describe(AppNavBar.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('renders no login item for an invalid session', () => {
    setup({ lifecycle: { isValidToken: false } });

    expect(screen.queryByText('Authenticate')).not.toBeInTheDocument();
    expect(screen.queryByText('Log in')).not.toBeInTheDocument();
  });

  it('dispatches logout with the signed-out notice from the user menu', async () => {
    const user = userEvent.setup();
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({ lifecycle: { logout } });

    await user.click(screen.getByLabelText('alice'));
    await user.click(await screen.findByText('Log out'));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({ notice: 'signed-out' });
  });

  it('surfaces logout failure and allows retry when the cookie was not cleared', async () => {
    const user = userEvent.setup();
    const logout = jest
      .fn()
      .mockRejectedValueOnce(new Error('network failure'))
      .mockResolvedValue(undefined);
    setup({ lifecycle: { logout } });

    await user.click(screen.getByLabelText('alice'));
    await user.click(await screen.findByText('Log out'));
    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(mockEnqueue).toHaveBeenCalledWith(
      { message: 'network failure' },
      expect.any(Number)
    );

    await user.click(screen.getAllByLabelText('alice')[0]);
    await user.click(await screen.findByText('Log out'));

    expect(logout).toHaveBeenCalledTimes(2);
    expect(logout).toHaveBeenCalledWith({ notice: 'signed-out' });
  });

  it('expires the session when the token flips invalid in place', () => {
    const { rerender, logout, expireSession } = setup({});

    mockUseAuthLifecycle.mockReturnValue(
      buildLifecycle({ isValidToken: false, logout, expireSession })
    );
    rerender(<AppNavBar />);

    expect(expireSession).toHaveBeenCalledTimes(1);
    expect(logout).not.toHaveBeenCalled();
  });
});

function setup({ lifecycle }: { lifecycle?: Partial<AuthLifecycle> }) {
  const built = buildLifecycle(lifecycle);
  mockUseAuthLifecycle.mockReturnValue(built);
  return {
    ...render(<AppNavBar />),
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
