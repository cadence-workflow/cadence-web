import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthContext, type AuthRequest } from '@/utils/auth/auth.types';
import getAuthenticatedUserInfo from '@/utils/auth/get-authenticated-user-info';

import getTrustedHeaderGrpcMetadata from '../get-trusted-header-grpc-metadata';
import resolveTrustedHeaderAuthContext from '../resolve-trusted-header-auth-context';
import trustedHeaderServerPolicy from '../trusted-header-server-policy';

jest.mock('@/utils/auth/get-authenticated-user-info');
jest.mock('../get-trusted-header-grpc-metadata');
jest.mock('../resolve-trusted-header-auth-context');

const mockGetAuthenticatedUserInfo =
  getAuthenticatedUserInfo as jest.MockedFunction<
    typeof getAuthenticatedUserInfo
  >;
const mockGetGrpcMetadata = getTrustedHeaderGrpcMetadata as jest.MockedFunction<
  typeof getTrustedHeaderGrpcMetadata
>;
const mockResolveContext =
  resolveTrustedHeaderAuthContext as jest.MockedFunction<
    typeof resolveTrustedHeaderAuthContext
  >;

const request: AuthRequest = {
  cookies: { get: () => undefined },
  headers: new Headers(),
};

const contextWith = (overrides: Partial<AuthContext>): AuthContext => ({
  authEnabled: true,
  auth: { isValidToken: true, canRefresh: false },
  isAdmin: false,
  groups: [],
  ...overrides,
});

describe('trustedHeaderServerPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveAuthContext', () => {
    it('delegates to the context resolver', async () => {
      const context = contextWith({});
      mockResolveContext.mockResolvedValue(context);

      await expect(
        trustedHeaderServerPolicy.resolveAuthContext(request)
      ).resolves.toBe(context);
      expect(mockResolveContext).toHaveBeenCalledWith(request);
    });
  });

  describe('getGrpcMetadata', () => {
    it('forwards nothing when auth is disabled', async () => {
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(
          contextWith({ authEnabled: false }),
          request
        )
      ).resolves.toBeUndefined();
      expect(mockGetGrpcMetadata).not.toHaveBeenCalled();
    });

    it('forwards nothing when the context is invalid', async () => {
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(
          contextWith({
            auth: { isValidToken: false, canRefresh: false },
          }),
          request
        )
      ).resolves.toBeUndefined();
      expect(mockGetGrpcMetadata).not.toHaveBeenCalled();
    });

    it('forwards the mapped metadata when the context is valid', async () => {
      mockGetGrpcMetadata.mockResolvedValue({ 'cadence-team': 'eng' });

      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(contextWith({}), request)
      ).resolves.toEqual({ 'cadence-team': 'eng' });
      expect(mockGetGrpcMetadata).toHaveBeenCalledWith(request);
    });
  });

  describe('getLoginRedirectIfNeeded', () => {
    it('returns null when the context is valid', () => {
      expect(
        trustedHeaderServerPolicy.getLoginRedirectIfNeeded(
          contextWith({}),
          '/workflows'
        )
      ).toBeNull();
    });

    it('redirects to the unavailable page when the context is invalid', () => {
      expect(
        trustedHeaderServerPolicy.getLoginRedirectIfNeeded(
          contextWith({ auth: { isValidToken: false, canRefresh: false } }),
          '/workflows'
        )
      ).toBe(AUTH_UNAVAILABLE_PATH);
    });
  });

  describe('recoverSession', () => {
    it('fails loud — the strategy has no session to recover', async () => {
      await expect(
        trustedHeaderServerPolicy.recoverSession(request, {})
      ).rejects.toThrow('trusted-header strategy has no session to recover');
    });
  });

  describe('getSessionKey', () => {
    it('keys the session on the backend identity id', async () => {
      mockGetAuthenticatedUserInfo.mockResolvedValue({
        id: 'user-1',
        userName: 'User One',
        isAdmin: false,
      });

      await expect(
        trustedHeaderServerPolicy.getSessionKey(request)
      ).resolves.toBe('user-1');
    });

    it('returns undefined when there is no identity', async () => {
      mockGetAuthenticatedUserInfo.mockResolvedValue(null);

      await expect(
        trustedHeaderServerPolicy.getSessionKey(request)
      ).resolves.toBeUndefined();
    });
  });
});
