import { FULL_ACCESS, NO_ACCESS } from '@/utils/auth/auth-shared.constants';

import domainAccess from '../domain-access';
import workflowActionsEnabled from '../workflow-actions-enabled';

jest.mock('../domain-access', () => jest.fn());
const mockDomainAccess = jest.mocked(domainAccess);

describe(workflowActionsEnabled.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns enabled actions when user has write access', async () => {
    mockDomainAccess.mockResolvedValue(FULL_ACCESS);

    const result = await workflowActionsEnabled({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(mockDomainAccess).toHaveBeenCalledWith({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });
    expect(result).toEqual({
      terminate: 'ENABLED',
      cancel: 'ENABLED',
      restart: 'ENABLED',
      reset: 'ENABLED',
      signal: 'ENABLED',
      start: 'ENABLED',
    });
  });

  it('returns unauthorized actions when write access is denied', async () => {
    mockDomainAccess.mockResolvedValue(NO_ACCESS);

    const result = await workflowActionsEnabled({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      terminate: 'DISABLED_UNAUTHORIZED',
      cancel: 'DISABLED_UNAUTHORIZED',
      restart: 'DISABLED_UNAUTHORIZED',
      reset: 'DISABLED_UNAUTHORIZED',
      signal: 'DISABLED_UNAUTHORIZED',
      start: 'DISABLED_UNAUTHORIZED',
    });
  });

  it('returns default-disabled actions when domain access resolution fails', async () => {
    mockDomainAccess.mockRejectedValue(new Error('boom'));

    const result = await workflowActionsEnabled({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      terminate: 'DISABLED_DEFAULT',
      cancel: 'DISABLED_DEFAULT',
      restart: 'DISABLED_DEFAULT',
      reset: 'DISABLED_DEFAULT',
      signal: 'DISABLED_DEFAULT',
      start: 'DISABLED_DEFAULT',
    });
  });
});
