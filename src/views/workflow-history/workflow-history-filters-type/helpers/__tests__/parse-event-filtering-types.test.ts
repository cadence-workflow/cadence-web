import { type WorkflowHistoryEventFilteringType } from '../../workflow-history-filters-type.types';
import parseEventFilteringTypes from '../parse-event-filtering-types';

describe(parseEventFilteringTypes.name, () => {
  it('should parse valid JSON string with valid event filtering types', () => {
    const validTypes: WorkflowHistoryEventFilteringType[] = [
      'ACTIVITY',
      'DECISION',
      'SIGNAL',
    ];
    const input = JSON.stringify(validTypes);

    const result = parseEventFilteringTypes(input);

    expect(result).toEqual(validTypes);
  });

  it('should return undefined for invalid JSON string', () => {
    const input = 'invalid json string';

    const result = parseEventFilteringTypes(input);

    expect(result).toBeUndefined();
  });

  it('should return undefined for malformed JSON', () => {
    const input = '["ACTIVITY", "DECISION"'; // Missing closing bracket

    const result = parseEventFilteringTypes(input);

    expect(result).toBeUndefined();
  });

  it('should return undefined when input is not a string', () => {
    const inputs = [null, undefined, 123, {}, [], true, false];

    inputs.forEach((input) => {
      const result = parseEventFilteringTypes(input);
      expect(result).toBeUndefined();
    });
  });

  it('should return undefined when parsed JSON is not an array', () => {
    const inputs = [
      JSON.stringify('ACTIVITY'),
      JSON.stringify({ type: 'ACTIVITY' }),
      JSON.stringify(123),
      JSON.stringify(null),
      JSON.stringify(true),
    ];

    inputs.forEach((input) => {
      const result = parseEventFilteringTypes(input);
      expect(result).toBeUndefined();
    });
  });

  it('should return undefined when array contains non-string values', () => {
    const inputs = [
      JSON.stringify(['ACTIVITY', 123, 'DECISION']),
      JSON.stringify(['ACTIVITY', null, 'DECISION']),
      JSON.stringify(['ACTIVITY', {}, 'DECISION']),
      JSON.stringify(['ACTIVITY', [], 'DECISION']),
    ];

    inputs.forEach((input) => {
      const result = parseEventFilteringTypes(input);
      expect(result).toBeUndefined();
    });
  });

  it('should return undefined when array contains invalid event filtering types', () => {
    const inputs = [
      JSON.stringify(['ACTIVITY', 'INVALID_TYPE', 'DECISION']),
      JSON.stringify(['ACTIVITY', '', 'DECISION']),
    ];

    inputs.forEach((input) => {
      const result = parseEventFilteringTypes(input);
      expect(result).toBeUndefined();
    });
  });

  it('should parse empty array correctly', () => {
    const input = JSON.stringify([]);

    const result = parseEventFilteringTypes(input);

    expect(result).toHaveLength(0);
  });

  it('should handle mixed case sensitivity correctly', () => {
    const validInput = JSON.stringify(['ACTIVITY', 'DECISION', 'SIGNAL']);
    const invalidInput = JSON.stringify(['activity', 'DECISION', 'signal']);

    const validResult = parseEventFilteringTypes(validInput);
    const invalidResult = parseEventFilteringTypes(invalidInput);

    expect(validResult).toEqual(['ACTIVITY', 'DECISION', 'SIGNAL']);
    expect(invalidResult).toBeUndefined();
  });

  it('should handle whitespace in JSON string', () => {
    const input = '  ["ACTIVITY", "DECISION"]  ';

    const result = parseEventFilteringTypes(input);

    expect(result).toEqual(['ACTIVITY', 'DECISION']);
  });
});
