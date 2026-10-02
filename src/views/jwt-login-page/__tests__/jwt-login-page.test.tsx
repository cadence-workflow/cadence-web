import { HttpResponse } from 'msw';

import { render, screen, waitFor, userEvent } from '@/test-utils/rtl';

import { type AuthMeResponse } from '@/utils/auth/auth.types';

import JwtLoginPage from '../jwt-login-page';

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
    push: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

const jwtInvalid: AuthMeResponse = {
  authEnabled: true,
  authStrategy: 'jwt',
  auth: { isValidToken: false },
  isAdmin: false,
};

const jwtValid: AuthMeResponse = {
  authEnabled: true,
  authStrategy: 'jwt',
  auth: { isValidToken: true },
  isAdmin: false,
  userName: 'alice',
};

describe(JwtLoginPage.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('renders the token form', async () => {
    setup({ authResolver: () => jwtInvalid });

    expect(await screen.findByTestId('jwt-login-submit')).toBeInTheDocument();
    expect(
      screen.getByText('Cadence · JWT authentication')
    ).toBeInTheDocument();
    const tokenInput = screen.getByRole('textbox');
    expect(tokenInput).toHaveAttribute('autocomplete', 'off');
    expect(tokenInput).toHaveAttribute('spellcheck', 'false');
  });

  it('shows a spinner in the card while auth loads', async () => {
    let releaseAuth!: (value: AuthMeResponse) => void;
    const authPending = new Promise<AuthMeResponse>((resolve) => {
      releaseAuth = resolve;
    });
    setup({ authResolver: () => authPending });

    expect(await screen.findByTestId('jwt-login-loading')).toBeInTheDocument();
    expect(
      screen.getByText('Cadence · JWT authentication')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('jwt-login-submit')).not.toBeInTheDocument();

    releaseAuth(jwtInvalid);
    expect(await screen.findByTestId('jwt-login-submit')).toBeInTheDocument();
  });

  it('redirects to returnTo when the session is already valid', async () => {
    mockSearchParams = new URLSearchParams({ returnTo: '/domains/foo' });
    setup({ authResolver: () => jwtValid });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/domains/foo');
    });
    expect(screen.queryByTestId('jwt-login-submit')).not.toBeInTheDocument();
  });

  it('normalizes returnTo=/login to / for an already-valid session', async () => {
    mockSearchParams = new URLSearchParams({ returnTo: '/login' });
    setup({ authResolver: () => jwtValid });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('shows the session-expired copy only for notice=session-expired', async () => {
    mockSearchParams = new URLSearchParams({ notice: 'session-expired' });
    setup({ authResolver: () => jwtInvalid });

    expect(
      await screen.findByText(
        'Your session expired. Paste a new JWT to continue.'
      )
    ).toBeInTheDocument();
    expect(await screen.findByTestId('jwt-login-submit')).toBeInTheDocument();
  });

  it('shows the signed-out copy for notice=signed-out', async () => {
    mockSearchParams = new URLSearchParams({ notice: 'signed-out' });
    setup({ authResolver: () => jwtInvalid });

    expect(
      await screen.findByText(
        'You have been signed out. Paste a new JWT to continue.'
      )
    ).toBeInTheDocument();
    expect(await screen.findByTestId('jwt-login-submit')).toBeInTheDocument();
  });

  it('renders no banner for an unknown notice value', async () => {
    mockSearchParams = new URLSearchParams({ notice: 'bogus' });
    setup({ authResolver: () => jwtInvalid });

    expect(await screen.findByTestId('jwt-login-submit')).toBeInTheDocument();
    expect(screen.queryByText(/Paste a new JWT/)).not.toBeInTheDocument();
  });

  it('shows inline validation and skips POST when the token is blank', async () => {
    const { user, postTokenHandler } = setup({
      authResolver: () => jwtInvalid,
    });

    await screen.findByTestId('jwt-login-submit');
    await user.click(screen.getByTestId('jwt-login-submit'));

    expect(
      await screen.findByText('Please paste a JWT token first')
    ).toBeInTheDocument();
    expect(postTokenHandler).not.toHaveBeenCalled();
  });

  it('posts the token and redirects to returnTo on success', async () => {
    let currentAuth = jwtInvalid;
    mockSearchParams = new URLSearchParams({ returnTo: '/domains/foo' });
    const { user, postTokenHandler } = setup({
      authResolver: () => currentAuth,
      onPostToken: () => {
        currentAuth = jwtValid;
      },
    });

    await screen.findByTestId('jwt-login-submit');
    await user.type(screen.getByRole('textbox'), 'header.payload.signature');
    await user.click(screen.getByTestId('jwt-login-submit'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/domains/foo');
    });
    expect(postTokenHandler).toHaveBeenCalled();
  });

  it('shows an error when the session is still invalid after saving', async () => {
    const { user } = setup({ authResolver: () => jwtInvalid });

    await screen.findByTestId('jwt-login-submit');
    await user.type(screen.getByRole('textbox'), 'header.payload.signature');
    await user.click(screen.getByTestId('jwt-login-submit'));

    expect(
      await screen.findByText('Token is expired or invalid')
    ).toBeInTheDocument();
  });

  it('shows the request error when auth validation cannot be completed', async () => {
    const { user } = setup({
      authResolver: () => jwtInvalid,
      authErrorAfterPost: true,
    });

    await screen.findByTestId('jwt-login-submit');
    await user.type(screen.getByRole('textbox'), 'header.payload.signature');
    await user.click(screen.getByTestId('jwt-login-submit'));

    expect(
      await screen.findByText('Authentication service unavailable')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Token is expired or invalid')
    ).not.toBeInTheDocument();
  });
});

function setup({
  authResolver,
  onPostToken,
  authErrorAfterPost = false,
}: {
  authResolver: () => AuthMeResponse | Promise<AuthMeResponse>;
  onPostToken?: () => void;
  authErrorAfterPost?: boolean;
}) {
  let tokenPosted = false;
  const postTokenHandler = jest.fn(async () => {
    tokenPosted = true;
    onPostToken?.();
    return HttpResponse.json({ ok: true });
  });

  const user = userEvent.setup();
  render(<JwtLoginPage />, {
    endpointsMocks: [
      {
        path: '/api/auth/me',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: async () =>
          authErrorAfterPost && tokenPosted
            ? HttpResponse.json(
                { message: 'Authentication service unavailable' },
                { status: 503 }
              )
            : HttpResponse.json(await authResolver()),
      },
      {
        path: '/api/auth/token',
        httpMethod: 'POST' as const,
        mockOnce: false,
        httpResolver: postTokenHandler,
      },
    ],
  });

  return { user, postTokenHandler };
}
