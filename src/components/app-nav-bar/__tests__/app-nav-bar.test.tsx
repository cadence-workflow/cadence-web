import React from 'react';

import { act, render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import AppNavBar from '../app-nav-bar';
import useAuthLifecycle from '../hooks/use-auth-lifecycle';
import { type AuthLifecycle } from '../hooks/use-auth-lifecycle.types';

jest.mock('../hooks/use-auth-lifecycle');

const mockEnqueue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  // baseui's real enqueue is a new closure per provider render; mirror that
  // so an effect depending on its identity re-fires here the way it would
  // in production.
  useSnackbar: () => ({
    enqueue: (...args: Parameters<typeof mockEnqueue>) => mockEnqueue(...args),
    dequeue: jest.fn(),
  }),
}));

const mockReplace = jest.fn();
let mockPathname = '/domains';
let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

const mockUseAuthLifecycle = useAuthLifecycle as jest.MockedFunction<
  typeof useAuthLifecycle
>;

const NOW = new Date('2026-09-23T12:00:00Z').getTime();

describe(AppNavBar.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/domains';
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    jest.useRealTimers();
    window.history.replaceState({}, '', '/');
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

  it('handles logout failure after the policy redirects to login', async () => {
    const user = userEvent.setup();
    const logout = jest
      .fn()
      .mockRejectedValueOnce(new Error('network failure'))
      .mockResolvedValue(undefined);
    setup({ lifecycle: { logout } });

    await user.click(screen.getByLabelText('alice'));
    await user.click(await screen.findByText('Log out'));
    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    await user.click(screen.getAllByLabelText('alice')[0]);
    await user.click(await screen.findByText('Log out'));

    expect(logout).toHaveBeenCalledTimes(2);
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

  it('recovers through the timer at expiry when canRecover is true, reading the live URL', async () => {
    window.history.replaceState({}, '', '/domains?cluster=prod');
    const recoverSession = jest.fn().mockResolvedValue({ kind: 'recovered' });
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({
      lifecycle: {
        canRecover: true,
        expiresAtMs: NOW + 30_000,
        recoverSession,
        logout,
      },
      fakeTimers: true,
    });

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(recoverSession).toHaveBeenCalledTimes(1);
    // Read at fire time from the real browser URL, not captured in deps.
    expect(recoverSession).toHaveBeenCalledWith('/domains?cluster=prod');
    expect(logout).not.toHaveBeenCalled();
  });

  it('logs out with the session-expired notice when recovery rejects at expiry', async () => {
    const recoverSession = jest
      .fn()
      .mockRejectedValue(new Error('network down'));
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({
      lifecycle: {
        canRecover: true,
        expiresAtMs: NOW + 30_000,
        recoverSession,
        logout,
      },
      fakeTimers: true,
    });

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(recoverSession).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({ notice: 'session-expired' });
  });

  it('does not re-fire the timer when recovery returns an unchanged expiresAtMs (livelock pin)', async () => {
    // recovered with the SAME expiresAtMs: the effect deps don't change, so
    // no re-arm — an imperative re-arm would loop recovery forever.
    const recoverSession = jest
      .fn()
      .mockResolvedValue({ kind: 'recovered', expiresAtMs: NOW + 30_000 });
    const { rerender } = setup({
      lifecycle: {
        canRecover: true,
        expiresAtMs: NOW + 30_000,
        recoverSession,
      },
      fakeTimers: true,
    });

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });
    await act(async () => {
      jest.advanceTimersByTime(300_000);
    });

    // A URL-only change must not re-arm the timer either.
    window.history.replaceState({}, '', '/domains?cluster=other');
    rerender(<AppNavBar />);
    await act(async () => {
      jest.advanceTimersByTime(300_000);
    });

    expect(recoverSession).toHaveBeenCalledTimes(1);
  });

  it('logs out at expiry when canRecover is false', async () => {
    const recoverSession = jest.fn();
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({
      lifecycle: {
        canRecover: false,
        expiresAtMs: NOW + 30_000,
        recoverSession,
        logout,
      },
      fakeTimers: true,
    });

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(recoverSession).not.toHaveBeenCalled();
    expect(logout).toHaveBeenCalledWith({ notice: 'session-expired' });
  });

  it('logs out when recovery is declined at expiry', async () => {
    const recoverSession = jest.fn().mockResolvedValue(undefined);
    const logout = jest.fn().mockResolvedValue(undefined);
    setup({
      lifecycle: {
        canRecover: true,
        expiresAtMs: NOW + 30_000,
        recoverSession,
        logout,
      },
      fakeTimers: true,
    });

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(recoverSession).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({ notice: 'session-expired' });
  });

  it('warns within 15s of expiry when the session cannot recover', () => {
    setup({
      lifecycle: { canRecover: false, expiresAtMs: Date.now() + 10_000 },
    });

    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Session expiring soon. You will be signed out shortly.',
      }),
      expect.anything()
    );
  });

  it('does not warn when the session can recover, even within 15s', () => {
    setup({
      lifecycle: { canRecover: true, expiresAtMs: Date.now() + 10_000 },
    });

    expect(mockEnqueue).not.toHaveBeenCalled();
  });

  it('arms the warning ahead of expiry and fires it inside the window', async () => {
    setup({
      lifecycle: { canRecover: false, expiresAtMs: NOW + 30_000 },
      fakeTimers: true,
    });
    expect(mockEnqueue).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(15_001);
    });

    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Session expiring soon. You will be signed out shortly.',
      }),
      expect.anything()
    );
  });

  it('warns once per expiry value across re-renders inside the warning window', () => {
    const { rerender } = setup({
      lifecycle: { canRecover: false, expiresAtMs: Date.now() + 10_000 },
    });
    expect(mockEnqueue).toHaveBeenCalledTimes(1);

    rerender(<AppNavBar />);
    rerender(<AppNavBar />);

    expect(mockEnqueue).toHaveBeenCalledTimes(1);
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

  describe('authNotice/authLoop param stripping', () => {
    it('renders the session-expired snackbar post-login and strips both params', () => {
      mockSearchParams = new URLSearchParams(
        'authNotice=session-expired&authLoop=123&cluster=prod'
      );
      setup({});

      expect(mockReplace).toHaveBeenCalledWith('/domains?cluster=prod');
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Your session expired. You have been signed in again.',
        }),
        expect.anything()
      );
    });

    it('renders the signed-out snackbar', () => {
      mockSearchParams = new URLSearchParams('authNotice=signed-out');
      setup({});

      expect(mockReplace).toHaveBeenCalledWith('/domains');
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'You have been signed out.' }),
        expect.anything()
      );
    });

    it('strips an unknown notice value without rendering a snackbar', () => {
      mockSearchParams = new URLSearchParams('authNotice=bogus');
      setup({});

      expect(mockReplace).toHaveBeenCalledWith('/domains');
      expect(mockEnqueue).not.toHaveBeenCalled();
    });

    it('strips without a snackbar while the token is invalid', () => {
      mockSearchParams = new URLSearchParams('authNotice=session-expired');
      setup({ lifecycle: { isValidToken: false } });

      expect(mockReplace).toHaveBeenCalledWith('/domains');
      expect(mockEnqueue).not.toHaveBeenCalled();
    });

    it('does not strip while auth is loading', () => {
      mockSearchParams = new URLSearchParams('authNotice=signed-out');
      setup({ lifecycle: { isAuthLoading: true } });

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('handles a notice URL once across re-renders while the strip is in flight', () => {
      mockSearchParams = new URLSearchParams('authNotice=signed-out');
      const { rerender } = setup({});

      rerender(<AppNavBar />);
      rerender(<AppNavBar />);

      expect(mockReplace).toHaveBeenCalledTimes(1);
      expect(mockEnqueue).toHaveBeenCalledTimes(1);
    });

    it('never navigates away from the current path when stripping (no /auth-unavailable trap)', () => {
      mockPathname = '/auth-unavailable';
      mockSearchParams = new URLSearchParams('authLoop=123');
      setup({});

      expect(mockReplace).toHaveBeenCalledWith('/auth-unavailable');
    });
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
    canRecover: false,
    logout: jest.fn().mockResolvedValue(undefined),
    recoverSession: jest.fn().mockResolvedValue({ kind: 'recovered' }),
    ...overrides,
  };
}
