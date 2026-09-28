import { HttpResponse } from 'msw';

import { render, screen, waitFor, userEvent } from '@/test-utils/rtl';

import { type PublicAuthContext } from '@/utils/auth/auth-shared.types';

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

const jwtInvalid: PublicAuthContext = {
  authEnabled: true,
  auth: { isValidToken: false },
  groups: [],
  isAdmin: false,
};

const jwtValid: PublicAuthContext = {
  authEnabled: true,
  auth: { isValidToken: true },
  groups: [],
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

    expect(
      await screen.findByText('Authenticate with JWT')
    ).toBeInTheDocument();
    expect(screen.getByTestId('jwt-login-submit')).toBeInTheDocument();
  });

  it('redirects to returnTo when the session is already valid', async () => {
    mockSearchParams = new URLSearchParams({ returnTo: '/domains/foo' });
    setup({ authResolver: () => jwtValid });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/domains/foo');
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
  });

  it('shows the signed-out copy for notice=signed-out', async () => {
    mockSearchParams = new URLSearchParams({ notice: 'signed-out' });
    setup({ authResolver: () => jwtInvalid });

    expect(
      await screen.findByText(
        'You have been signed out. Paste a new JWT to continue.'
      )
    ).toBeInTheDocument();
  });

  it('renders no banner for an unknown notice value', async () => {
    mockSearchParams = new URLSearchParams({ notice: 'bogus' });
    setup({ authResolver: () => jwtInvalid });

    expect(
      await screen.findByText('Authenticate with JWT')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Paste a new JWT/)).not.toBeInTheDocument();
  });

  it('shows inline validation and skips POST when the token is blank', async () => {
    const { user, postTokenHandler } = setup({
      authResolver: () => jwtInvalid,
    });

    await screen.findByText('Authenticate with JWT');
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

    await screen.findByText('Authenticate with JWT');
    // the textarea is disabled while /api/auth/me loads — typing before it
    // enables silently no-ops
    await waitFor(() => expect(screen.getByRole('textbox')).toBeEnabled());
    await user.type(screen.getByRole('textbox'), 'header.payload.signature');
    await user.click(screen.getByTestId('jwt-login-submit'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/domains/foo');
    });
    expect(postTokenHandler).toHaveBeenCalled();
  });

  it('shows an error when the session is still invalid after saving', async () => {
    const { user } = setup({ authResolver: () => jwtInvalid });

    await screen.findByText('Authenticate with JWT');
    // the textarea is disabled while /api/auth/me loads — typing before it
    // enables silently no-ops
    await waitFor(() => expect(screen.getByRole('textbox')).toBeEnabled());
    await user.type(screen.getByRole('textbox'), 'header.payload.signature');
    await user.click(screen.getByTestId('jwt-login-submit'));

    expect(
      await screen.findByText('Token is expired or invalid')
    ).toBeInTheDocument();
  });
});

function setup({
  authResolver,
  onPostToken,
}: {
  authResolver: () => PublicAuthContext;
  onPostToken?: () => void;
}) {
  const postTokenHandler = jest.fn(async () => {
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
        httpResolver: () => HttpResponse.json(authResolver()),
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
