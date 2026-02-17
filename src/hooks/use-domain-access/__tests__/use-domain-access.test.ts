import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import useDomainAccess from '../use-domain-access';

describe(useDomainAccess.name, () => {
  it('returns full access when auth is disabled', async () => {
    const { result } = setup({
      authResponse: {
        authEnabled: false,
        isAuthenticated: false,
        isAdmin: false,
        groups: [],
      },
    });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: true,
        canWrite: true,
      });
    });
  });

  it('derives access from domain groups when auth is enabled', async () => {
    const { result } = setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: false,
        groups: ['reader'],
      },
      domainResponse: {
        name: 'test-domain',
        data: {
          READ_GROUPS: 'reader',
          WRITE_GROUPS: 'writer',
        },
      },
    });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: true,
        canWrite: false,
      });
    });
  });

  it('grants write access when the user is in the write group', async () => {
    const { result } = setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: false,
        groups: ['writer'],
      },
      domainResponse: {
        name: 'test-domain',
        data: {
          READ_GROUPS: 'reader',
          WRITE_GROUPS: 'writer',
        },
      },
    });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: true,
        canWrite: true,
      });
    });
  });

  it('grants full access to admin users', async () => {
    const { result } = setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: true,
        groups: [],
      },
      domainResponse: {
        name: 'test-domain',
        data: {
          READ_GROUPS: 'reader',
          WRITE_GROUPS: 'writer',
        },
      },
    });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: true,
        canWrite: true,
      });
    });
  });

  it('denies access for unauthenticated users when auth is enabled', async () => {
    const { result, domainRequestHandler } = setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: false,
        isAdmin: false,
        groups: [],
      },
    });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: false,
        canWrite: false,
      });
    });

    expect(domainRequestHandler).not.toHaveBeenCalled();
  });

  it('returns no access when the domain query fails', async () => {
    const { result } = setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: false,
        groups: ['reader'],
      },
      domainError: true,
    });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: false,
        canWrite: false,
      });
      expect(result.current.isError).toBe(true);
    });
  });

  it('returns no access when the user info query fails', async () => {
    const { result } = setup({ authError: true });

    await waitFor(() => {
      expect(result.current.access).toEqual({
        canRead: false,
        canWrite: false,
      });
      expect(result.current.isError).toBe(true);
    });
  });

  it('reports loading while auth is pending', () => {
    const { result } = setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: false,
        groups: ['reader'],
      },
      domainResponse: {
        name: 'test-domain',
        data: {
          READ_GROUPS: 'reader',
          WRITE_GROUPS: 'writer',
        },
      },
    });

    expect(result.current.isLoading).toBe(true);
  });
});

function setup({
  authResponse,
  domainResponse,
  authError,
  domainError,
}: {
  authResponse?: Record<string, unknown>;
  domainResponse?: Record<string, unknown>;
  authError?: boolean;
  domainError?: boolean;
}) {
  const domainRequestHandler = jest.fn(async () => {
    if (domainError) {
      return HttpResponse.json(
        { message: 'Failed to fetch domain' },
        { status: 500 }
      );
    }

    return HttpResponse.json(domainResponse ?? {});
  });

  const { result } = renderHook(
    () =>
      useDomainAccess({
        domain: 'test-domain',
        cluster: 'test-cluster',
      }),
    {
      endpointsMocks: [
        {
          path: '/api/auth/me',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (authError) {
              return HttpResponse.json(
                { message: 'Failed to fetch auth info' },
                { status: 500 }
              );
            }
            return HttpResponse.json(
              authResponse ?? {
                authEnabled: true,
                isAuthenticated: true,
                isAdmin: false,
                groups: [],
              }
            );
          },
        },
        {
          path: '/api/domains/test-domain/test-cluster',
          httpMethod: 'GET' as const,
          mockOnce: false,
          httpResolver: domainRequestHandler,
        },
      ],
    }
  );

  return { result, domainRequestHandler };
}
