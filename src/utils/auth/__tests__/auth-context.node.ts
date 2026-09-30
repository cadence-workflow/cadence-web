import { getMockAuthContext } from '../__fixtures__/mock-auth-context';
import { getMockAuthRequest } from '../__fixtures__/mock-auth-request';
import { getMockAuthServerRegistryEntry } from '../__fixtures__/mock-auth-server-registry-entry';
import { resolveAuthContext } from '../auth-context';
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
    const context = getMockAuthContext();
    const resolveAuthContextMock = jest.fn().mockResolvedValue(context);
    mockGetActiveAuthServerEntry.mockResolvedValue(
      getMockAuthServerRegistryEntry({
        resolveAuthContext: resolveAuthContextMock,
      })
    );

    const request = getMockAuthRequest();

    await expect(resolveAuthContext(request)).resolves.toBe(context);
    expect(resolveAuthContextMock).toHaveBeenCalledWith(request);
  });
});
