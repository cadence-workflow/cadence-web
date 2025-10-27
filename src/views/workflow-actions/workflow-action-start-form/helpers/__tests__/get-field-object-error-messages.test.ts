import getFieldObjectErrorMessages from '../get-field-object-error-messages';

describe('getFieldObjectErrorMessages', () => {
  it('should return undefined when field has no error', () => {
    const fieldErrors = {};

    const result = getFieldObjectErrorMessages(fieldErrors, 'cronSchedule');

    expect(result).toBeUndefined();
  });

  it('should return string message when field has a simple message error', () => {
    const fieldErrors = {
      cronSchedule: {
        message: 'Invalid cron schedule',
        type: 'invalid',
      },
    };

    const result = getFieldObjectErrorMessages(fieldErrors, 'cronSchedule');

    expect(result).toBe('Invalid cron schedule');
  });

  it('should return Record<string, string> for object field errors without message', () => {
    const fieldErrors = {
      cronSchedule: {
        minute: {
          message: 'Must be a positive number',
          type: 'min',
        },
        hour: {
          message: 'Must be at least 0',
          type: 'min',
        },
      },
    };

    const result = getFieldObjectErrorMessages(fieldErrors, 'cronSchedule');

    expect(result).toEqual({
      minute: 'Must be a positive number',
      hour: 'Must be at least 0',
    });
  });

  it('should handle object errors with some fields having no message', () => {
    const fieldErrors = {
      cronSchedule: {
        minute: {
          message: 'Invalid minute',
          type: 'invalid',
        },
        hour: undefined,
        day: {
          message: 'Invalid day',
          type: 'invalid',
        },
      },
    };

    const result = getFieldObjectErrorMessages(fieldErrors, 'cronSchedule');

    expect(result).toEqual({
      minute: 'Invalid minute',
      day: 'Invalid day',
    });
  });

  it('should return undefined when object has no error messages', () => {
    const fieldErrors = {
      cronSchedule: {
        minute: undefined,
        hour: undefined,
      },
    };

    const result = getFieldObjectErrorMessages(fieldErrors, 'cronSchedule');

    expect(result).toBeUndefined();
  });
});
