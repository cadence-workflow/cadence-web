import getCanonicalEventIdFromIssueMetadata from '../get-canonical-event-id-from-issue-metadata';

describe('getCanonicalEventIdFromIssueMetadata', () => {
  it('should return EventID when present and non-zero', () => {
    const metadata = {
      ActivityScheduledID: 100,
      ActivityStartedID: 200,
      EventID: 300,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('300');
  });

  it('should return fallback event ID when EventID is zero', () => {
    const metadata = {
      ActivityScheduledID: 100,
      ActivityStartedID: 200,
      EventID: 0,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });

  it('should return fallback event ID when metadata is null', () => {
    expect(getCanonicalEventIdFromIssueMetadata(null)).toBe('1');
  });

  it('should return fallback event ID when metadata is undefined', () => {
    expect(getCanonicalEventIdFromIssueMetadata(undefined)).toBe('1');
  });

  it('should return fallback event ID when metadata is not an object', () => {
    expect(getCanonicalEventIdFromIssueMetadata('string')).toBe('1');
    expect(getCanonicalEventIdFromIssueMetadata(123)).toBe('1');
  });

  it('should return fallback event ID when metadata has no EventID field', () => {
    const metadata = {
      SomeOtherField: 100,
      AnotherField: 'value',
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });

  it('should convert numeric EventID to string', () => {
    const metadata = {
      EventID: 42,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('42');
  });

  it('should ignore nested EventID values', () => {
    const metadata = {
      ActivityScheduleBurst: {
        EventID: 150,
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });

  it('should ignore other event ID fields', () => {
    const metadata = {
      FailedEventID: 123,
      ActivityScheduledID: 100,
      LastEventID: 150,
      StartedEventID: 200,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });

  it('should return fallback when EventID is not a number', () => {
    const metadata = {
      EventID: 'not-a-number',
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });
});
