import { FULL_ACCESS, NO_ACCESS } from '@/utils/auth/auth-shared.constants';

import domainAccess from '../domain-access';
import scheduleActionsEnabled from '../schedule-actions-enabled';

jest.mock('../domain-access', () => jest.fn());
const mockDomainAccess = jest.mocked(domainAccess);

describe(scheduleActionsEnabled.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns enabled actions when user has write access', async () => {
    mockDomainAccess.mockResolvedValue(FULL_ACCESS);

    const result = await scheduleActionsEnabled({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(mockDomainAccess).toHaveBeenCalledWith({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });
    expect(result).toEqual({
      pause: 'ENABLED',
      resume: 'ENABLED',
      delete: 'ENABLED',
      backfill: 'ENABLED',
    });
  });

  it('returns unauthorized actions when write access is denied', async () => {
    mockDomainAccess.mockResolvedValue(NO_ACCESS);

    const result = await scheduleActionsEnabled({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      pause: 'DISABLED_UNAUTHORIZED',
      resume: 'DISABLED_UNAUTHORIZED',
      delete: 'DISABLED_UNAUTHORIZED',
      backfill: 'DISABLED_UNAUTHORIZED',
    });
  });

  it('returns default-disabled actions when domain access resolution fails', async () => {
    mockDomainAccess.mockRejectedValue(new Error('boom'));

    const result = await scheduleActionsEnabled({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      pause: 'DISABLED_DEFAULT',
      resume: 'DISABLED_DEFAULT',
      delete: 'DISABLED_DEFAULT',
      backfill: 'DISABLED_DEFAULT',
    });
  });
});
