import { type NextRequest } from 'next/server';

import { getMockAuthContext } from '@/utils/auth/__fixtures__/mock-auth-context';
import { resolveAuthContext } from '@/utils/auth/auth-context';

import authInfoMiddleware from '../auth-info';

jest.mock('@/utils/auth/auth-context', () => ({
  resolveAuthContext: jest.fn(),
}));

const mockResolveAuthContext = jest.mocked(resolveAuthContext);
const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
  headers: new Headers({ 'x-forwarded-host': 'cadence.example' }),
} as unknown as NextRequest;
const mockOptions = { params: {} };

describe('auth-info middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns auth context from resolveAuthContext', async () => {
    const mockAuthContext = getMockAuthContext();
    mockResolveAuthContext.mockResolvedValue(mockAuthContext);

    const result = await authInfoMiddleware(mockRequest, mockOptions, {});

    expect(result).toEqual(['authInfo', mockAuthContext]);
    expect(mockResolveAuthContext).toHaveBeenCalledWith({
      cookies: mockRequest.cookies,
      headers: mockRequest.headers,
    });
    expect(mockResolveAuthContext.mock.calls[0][0]?.headers).toBe(
      mockRequest.headers
    );
  });
});
