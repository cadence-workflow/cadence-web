import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import useUserInfo from '../use-user-info';

describe(useUserInfo.name, () => {
  it('should return user info from the API', async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        authEnabled: true,
        isAuthenticated: true,
      });
    });
  });

  it('should surface errors when the API fails', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
  });

  function setup({ error }: { error?: boolean } = {}) {
    const { result } = renderHook(() => useUserInfo(), {
      endpointsMocks: [
        {
          path: '/api/auth/me',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch auth info' },
                { status: 500 }
              );
            }
            return HttpResponse.json({
              authEnabled: true,
              isAuthenticated: true,
              isAdmin: false,
              groups: ['reader'],
            });
          },
        },
      ],
    });

    return { result };
  }
});
