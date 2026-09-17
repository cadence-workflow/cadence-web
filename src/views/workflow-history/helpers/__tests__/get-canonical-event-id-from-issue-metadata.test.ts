import getCanonicalEventIdFromIssueMetadata from '../get-canonical-event-id-from-issue-metadata';

describe('getCanonicalEventIdFromIssueMetadata', () => {
  it('should return ActivityScheduledID when present and non-zero', () => {
    const metadata = {
      ActivityScheduledID: 100,
      ActivityStartedID: 200,
      EventID: 300,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('100');
  });

  it('should fall back to ActivityStartedID when ActivityScheduledID is zero', () => {
    const metadata = {
      ActivityScheduledID: 0,
      ActivityStartedID: 200,
      EventID: 300,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('200');
  });

  it('should fall back to EventID when other IDs are zero', () => {
    const metadata = {
      ActivityScheduledID: 0,
      ActivityStartedID: 0,
      EventID: 300,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('300');
  });

  it('should return fallback event ID when all IDs are zero', () => {
    const metadata = {
      ActivityScheduledID: 0,
      ActivityStartedID: 0,
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

  it('should return fallback event ID when metadata has no event ID fields', () => {
    const metadata = {
      SomeOtherField: 100,
      AnotherField: 'value',
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });

  it('should convert numeric event ID to string', () => {
    const metadata = {
      ActivityScheduledID: 42,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('42');
  });

  it('should find nested FailedEventID in failure metadata', () => {
    const metadata = {
      FailedEventID: 123,
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('123');
  });

  it('should find nested EventID in timeout risk metadata', () => {
    const metadata = {
      EventID: 789,
      ActivityStartToCloseAtWorkflowTimeoutCap: {
        ActivityID: 'activity-1',
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('789');
  });

  it('should find nested LastEventID in antipattern metadata', () => {
    const metadata = {
      EventID: 100,
      ActivityScheduleBurst: {
        LastEventID: 150,
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('100');
  });

  it('should find StartedEventID in continue-as-new antipattern metadata', () => {
    const metadata = {
      EventID: 200,
      ContinueAsNewInCronWorkflow: {
        StartedEventID: 200,
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('200');
  });

  it('should find deeply nested LastOngoingEvent.ID in timeout metadata', () => {
    const metadata = {
      ExecutionTimeout: {
        LastOngoingEvent: {
          ID: 555,
        },
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });

  it('should prioritize top-level event IDs over nested ones', () => {
    const metadata = {
      ActivityScheduledID: 100,
      NestedObject: {
        EventID: 200,
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('100');
  });

  it('should return fallback when no event ID found at any depth', () => {
    const metadata = {
      SomeField: 'value',
      NestedObject: {
        AnotherField: 123,
      },
    };

    expect(getCanonicalEventIdFromIssueMetadata(metadata)).toBe('1');
  });
});
