import getVisibleGroupsHasMissingEvents from '../get-visible-groups-has-missing-events';

describe('getVisibleGroupsHasMissingEvents', () => {
  const groupEntries: [string, { hasMissingEvents: boolean }][] = [
    ['group1', { hasMissingEvents: false }],
    ['group2', { hasMissingEvents: true }],
    ['group3', { hasMissingEvents: false }],
    ['group4', { hasMissingEvents: true }],
  ];

  it('should return true if any event in the main visible range has missing events', () => {
    const visibleRanges = {
      startIndex: 0,
      endIndex: 2,
      compactStartIndex: 2,
      compactEndIndex: 3,
    };
    expect(getVisibleGroupsHasMissingEvents(groupEntries, visibleRanges)).toBe(
      true
    );
  });

  it('should return true if any event in the compact visible range has missing events', () => {
    const visibleRanges = {
      startIndex: 0,
      endIndex: 1,
      compactStartIndex: 2,
      compactEndIndex: 3,
    };
    expect(getVisibleGroupsHasMissingEvents(groupEntries, visibleRanges)).toBe(
      true
    );
  });

  it('should return false if no events in the visible range have missing events', () => {
    const visibleRanges = {
      startIndex: 0,
      endIndex: 0,
      compactStartIndex: 2,
      compactEndIndex: 2,
    };
    expect(getVisibleGroupsHasMissingEvents(groupEntries, visibleRanges)).toBe(
      false
    );
  });

  it('should handle an empty groupEntries array and return false', () => {
    const visibleRanges = {
      startIndex: 0,
      endIndex: 0,
      compactStartIndex: 0,
      compactEndIndex: 0,
    };
    expect(getVisibleGroupsHasMissingEvents([], visibleRanges)).toBe(false);
  });

  it('should handle out of range numbers and return false', () => {
    const visibleRanges = {
      startIndex: -1,
      endIndex: -1,
      compactStartIndex: 100,
      compactEndIndex: 200,
    };
    expect(getVisibleGroupsHasMissingEvents(groupEntries, visibleRanges)).toBe(
      false
    );
  });
});
