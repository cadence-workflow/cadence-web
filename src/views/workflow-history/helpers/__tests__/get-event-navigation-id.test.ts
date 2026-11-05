import getEventNavigationId from '../get-event-navigation-id';

describe(getEventNavigationId.name, () => {
  it('returns eventId for persisted events', () => {
    expect(
      getEventNavigationId({ eventId: '7', computedEventId: '7' })
    ).toBe('7');
  });

  it('returns computedEventId when eventId is null (synthetic pending event)', () => {
    expect(
      getEventNavigationId({ eventId: null, computedEventId: 'Pending-5' })
    ).toBe('Pending-5');
  });

  it('returns nullish when the event has no usable id', () => {
    expect(
      getEventNavigationId({ eventId: null, computedEventId: undefined })
    ).toBeUndefined();
    expect(getEventNavigationId({})).toBeUndefined();
  });
});
