import { getMockAuthContext } from '@/utils/auth/__fixtures__/mock-auth-context';
import { resolveAuthContext } from '@/utils/auth/auth-context';
import { FULL_ACCESS, NO_ACCESS } from '@/utils/auth/auth-shared.constants';

import batchActionsUiEnabled from '../batch-actions-ui-enabled';
import domainAccess from '../domain-access';

jest.mock('../domain-access', () => jest.fn());
jest.mock('@/utils/auth/auth-context', () => ({
  resolveAuthContext: jest.fn(),
}));

const mockDomainAccess = jest.mocked(domainAccess);
const mockResolveAuthContext = jest.mocked(resolveAuthContext);

const PARAMS = { cluster: 'test-cluster', domain: 'test-domain' };

describe(batchActionsUiEnabled.name, () => {
  const originalMode = process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = originalMode;
  });

  it('returns true for everyone in "ENABLED" mode', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'ENABLED';

    expect(await batchActionsUiEnabled(PARAMS)).toBe(true);
    expect(mockDomainAccess).not.toHaveBeenCalled();
    expect(mockResolveAuthContext).not.toHaveBeenCalled();
  });

  it('returns false when the env variable is unset', async () => {
    delete process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED;

    expect(await batchActionsUiEnabled(PARAMS)).toBe(false);
  });

  it('returns false for an unrecognised env value', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'bogus';

    expect(await batchActionsUiEnabled(PARAMS)).toBe(false);
  });

  it('returns canWrite from domain access in "WRITE" mode', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'WRITE';
    mockDomainAccess.mockResolvedValue(FULL_ACCESS);

    expect(await batchActionsUiEnabled(PARAMS)).toBe(true);
    expect(mockDomainAccess).toHaveBeenCalledWith(PARAMS);
  });

  it('returns false in "WRITE" mode when write access is denied', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'WRITE';
    mockDomainAccess.mockResolvedValue(NO_ACCESS);

    expect(await batchActionsUiEnabled(PARAMS)).toBe(false);
  });

  it('returns true in "ADMIN" mode for an admin user', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'ADMIN';
    mockResolveAuthContext.mockResolvedValue(
      getMockAuthContext({ isAdmin: true })
    );

    expect(await batchActionsUiEnabled(PARAMS)).toBe(true);
  });

  it('returns false in "ADMIN" mode for a non-admin user', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'ADMIN';
    mockResolveAuthContext.mockResolvedValue(
      getMockAuthContext({ isAdmin: false })
    );

    expect(await batchActionsUiEnabled(PARAMS)).toBe(false);
  });

  it('returns true in "ADMIN" mode when auth is disabled', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'ADMIN';
    mockResolveAuthContext.mockResolvedValue(
      getMockAuthContext({ authEnabled: false })
    );

    expect(await batchActionsUiEnabled(PARAMS)).toBe(true);
  });

  it('returns false when access resolution throws', async () => {
    process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED = 'WRITE';
    mockDomainAccess.mockRejectedValue(new Error('boom'));

    expect(await batchActionsUiEnabled(PARAMS)).toBe(false);
  });
});
