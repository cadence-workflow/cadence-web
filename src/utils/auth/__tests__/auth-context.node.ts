import { resolveAuthContext } from '../auth-context';
import { type AuthContext } from '../auth.types';
import getActiveAuthServerEntry from '../strategies/get-active-auth-server-entry';

jest.mock('../strategies/get-active-auth-server-entry', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGetActiveAuthServerEntry = jest.mocked(getActiveAuthServerEntry);

describe(resolveAuthContext.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates to the active server policy', async () => {
    const context: AuthContext = {
      authEnabled: true,
      auth: { isValidToken: true, canRefresh: false },
      isAdmin: false,
      groups: [],
    };
    const resolveAuthContextMock = jest.fn().mockResolvedValue(context);
    mockGetActiveAuthServerEntry.mockResolvedValue({
      policy: { resolveAuthContext: resolveAuthContextMock },
    } as unknown as Awaited<ReturnType<typeof getActiveAuthServerEntry>>);

    const request = {
      cookies: { get: () => undefined },
      headers: new Headers(),
    };

    await expect(resolveAuthContext(request)).resolves.toBe(context);
    expect(resolveAuthContextMock).toHaveBeenCalledWith(request);
  });
});
