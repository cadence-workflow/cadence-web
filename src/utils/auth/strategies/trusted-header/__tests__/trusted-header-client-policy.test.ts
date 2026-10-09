import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';

import trustedHeaderClientPolicy from '../trusted-header-client-policy';

describe('trustedHeaderClientPolicy', () => {
  it('declares the unavailable remedy with recovery unreachable', () => {
    expect(trustedHeaderClientPolicy.unauthenticatedRemedy).toBe('unavailable');
    expect(trustedHeaderClientPolicy.supportsSessionRecovery).toBe(false);
    expect(trustedHeaderClientPolicy.onUnauthorized(new Response())).toBe(
      false
    );
  });

  it('login sends the browser to the auth-unavailable page', () => {
    const assign = mockLocationAssign();

    trustedHeaderClientPolicy.login('/domains');

    expect(assign).toHaveBeenCalledWith(AUTH_UNAVAILABLE_PATH);
  });

  it('logout is a no-op (sign-out happens at the perimeter)', async () => {
    const assign = mockLocationAssign();

    await trustedHeaderClientPolicy.logout();

    expect(assign).not.toHaveBeenCalled();
  });
});

function mockLocationAssign() {
  const assign = jest.fn();
  jest.spyOn(window, 'location', 'get').mockReturnValue({
    ...window.location,
    assign,
  } as Location);
  return assign;
}
