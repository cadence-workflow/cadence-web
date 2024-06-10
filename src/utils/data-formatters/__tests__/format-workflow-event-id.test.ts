import formatWorkflowEventId from '../format-workflow-event-id';

describe('formatWorkflowEventId', () => {
  test('should return null if input is null', () => {
    expect(formatWorkflowEventId(null)).toBeNull();
  });

  test('should return null if input is undefined', () => {
    expect(formatWorkflowEventId(undefined)).toBeNull();
  });

  test('should return null if input is an empty string', () => {
    expect(formatWorkflowEventId('')).toBeNull();
  });

  test('should parse numeric string and return the number', () => {
    expect(formatWorkflowEventId('123')).toBe(123);
    expect(formatWorkflowEventId('-456')).toBe(-456);
    expect(formatWorkflowEventId('3.14')).toBe(3.14);
  });

  test('should return input as is if it is not a parsable number', () => {
    expect(formatWorkflowEventId('abc')).toBe('abc');
    expect(formatWorkflowEventId('123abc')).toBe('123abc');
    expect(formatWorkflowEventId('1.2.3')).toBe('1.2.3');
  });

  test('should return input number as is', () => {
    expect(formatWorkflowEventId(123)).toBe(123);
    expect(formatWorkflowEventId(-456)).toBe(-456);
    expect(formatWorkflowEventId(3.14)).toBe(3.14);
  });
});
