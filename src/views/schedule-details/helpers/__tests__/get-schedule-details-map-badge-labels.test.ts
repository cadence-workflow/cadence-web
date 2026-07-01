import getScheduleDetailsMapBadgeLabels from '../get-schedule-details-map-badge-labels';

describe(getScheduleDetailsMapBadgeLabels.name, () => {
  it('formats key-value pairs as badge labels', () => {
    expect(
      getScheduleDetailsMapBadgeLabels({
        CustomStringField: 'schedule-demo',
        CustomIntField: 42,
        CustomBoolField: true,
      })
    ).toEqual([
      'CustomStringField: "schedule-demo"',
      'CustomIntField: 42',
      'CustomBoolField: true',
    ]);
  });

  it('omits null values', () => {
    expect(
      getScheduleDetailsMapBadgeLabels({
        kept: 'value',
        dropped: null,
      })
    ).toEqual(['kept: "value"']);
  });

  it('returns an empty array when values are empty or absent', () => {
    expect(getScheduleDetailsMapBadgeLabels({})).toEqual([]);
    expect(getScheduleDetailsMapBadgeLabels(null)).toEqual([]);
    expect(getScheduleDetailsMapBadgeLabels(undefined)).toEqual([]);
  });
});
