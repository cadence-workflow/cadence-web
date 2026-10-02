import trustedHeaderClientPolicy from '../trusted-header-client-policy';

describe('trustedHeaderClientPolicy', () => {
  it('declares the unavailable remedy with recovery unreachable', () => {
    expect(trustedHeaderClientPolicy.unauthenticatedRemedy).toBe('unavailable');
    expect(trustedHeaderClientPolicy.supportsSessionRecovery).toBe(false);
    expect(trustedHeaderClientPolicy.onUnauthorized(new Response())).toBe(
      false
    );
  });

  it('has no browser credential actions (login/logout happen upstream)', async () => {
    const assign = mockLocationAssign();

    trustedHeaderClientPolicy.login('/domains');
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
