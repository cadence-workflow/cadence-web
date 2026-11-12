import getEventKey from '../get-event-key';

describe(getEventKey.name, () => {
  it('returns eventId for persisted events', () => {
    expect(getEventKey({ eventId: '7' })).toBe('7');
  });

  it('returns computedEventId for pending events', () => {
    expect(getEventKey({ eventId: null, computedEventId: 'Pending-5' })).toBe(
      'Pending-5'
    );
  });
});
