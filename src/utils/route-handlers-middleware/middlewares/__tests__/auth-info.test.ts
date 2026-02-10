import { resolveAuthContext } from '@/utils/auth/auth-context';

import authInfoMiddleware from '../auth-info';

jest.mock('@/utils/auth/auth-context', () => ({
  resolveAuthContext: jest.fn(),
}));

const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
} as any;

describe('auth-info middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns auth context from resolveAuthContext', async () => {
    const mockAuthContext = {
      authEnabled: true,
      token: 'abc',
      isAdmin: false,
      groups: [],
    };
    (resolveAuthContext as jest.Mock).mockResolvedValue(mockAuthContext);

    const result = await authInfoMiddleware(
      mockRequest,
      { params: {} } as any,
      {}
    );

    expect(result).toEqual(['authInfo', mockAuthContext]);
  });
});
