import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import CronScheduleInputPopover from '../cron-schedule-input-popover';

describe(CronScheduleInputPopover.name, () => {
  it('should render with minutes field type', () => {
    setup({ fieldType: 'minutes' });

    expect(screen.getByText('Minute')).toBeInTheDocument();
    expect(screen.getByText('0-59')).toBeInTheDocument();
    expect(screen.getByText('any value')).toBeInTheDocument();
    expect(screen.getByText('value list separator')).toBeInTheDocument();
    expect(screen.getByText('range of values')).toBeInTheDocument();
    expect(screen.getByText('step values')).toBeInTheDocument();
    expect(screen.getByText('allowed values')).toBeInTheDocument();
  });

  it('should render with hours field type', () => {
    setup({ fieldType: 'hours' });

    expect(screen.getByText('Hour')).toBeInTheDocument();
    expect(screen.getByText('0-23')).toBeInTheDocument();
  });

  it('should render with daysOfMonth field type', () => {
    setup({ fieldType: 'daysOfMonth' });

    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('0-31')).toBeInTheDocument();
  });

  it('should render with months field type and show month aliases', () => {
    setup({ fieldType: 'months' });

    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('0-12')).toBeInTheDocument();
    expect(screen.getByText('JAN-DEC')).toBeInTheDocument();
    expect(screen.getByText('alternative single values')).toBeInTheDocument();
  });

  it('should render with daysOfWeek field type and show day aliases', () => {
    setup({ fieldType: 'daysOfWeek' });

    expect(screen.getByText('Day of Week')).toBeInTheDocument();
    expect(screen.getByText('0-6')).toBeInTheDocument();
    expect(screen.getByText('SUN-SAT')).toBeInTheDocument();
    expect(screen.getByText('alternative single values')).toBeInTheDocument();
  });

  it('should not show month aliases for non-month field types', () => {
    setup({ fieldType: 'minutes' });

    expect(screen.queryByText('JAN-DEC')).not.toBeInTheDocument();
  });

  it('should not show day aliases for non-daysOfWeek field types', () => {
    setup({ fieldType: 'hours' });

    expect(screen.queryByText('SUN-SAT')).not.toBeInTheDocument();
  });

  it('should render all common cron symbols and descriptions', () => {
    setup({ fieldType: 'minutes' });

    // Common symbols
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText(',')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();

    // Common descriptions
    expect(screen.getByText('any value')).toBeInTheDocument();
    expect(screen.getByText('value list separator')).toBeInTheDocument();
    expect(screen.getByText('range of values')).toBeInTheDocument();
    expect(screen.getByText('step values')).toBeInTheDocument();
    expect(screen.getByText('allowed values')).toBeInTheDocument();
  });

  it('should display correct validation range for each field type', () => {
    const testCases = [
      { fieldType: 'minutes' as const, expectedRange: '0-59' },
      { fieldType: 'hours' as const, expectedRange: '0-23' },
      { fieldType: 'daysOfMonth' as const, expectedRange: '0-31' },
      { fieldType: 'months' as const, expectedRange: '0-12' },
      { fieldType: 'daysOfWeek' as const, expectedRange: '0-6' },
    ];

    testCases.forEach(({ fieldType, expectedRange }) => {
      const { unmount } = setup({ fieldType });
      expect(screen.getByText(expectedRange)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render alternative values only for months and daysOfWeek', () => {
    // Test months
    const { unmount: unmountMonths } = setup({ fieldType: 'months' });
    expect(screen.getByText('JAN-DEC')).toBeInTheDocument();
    expect(screen.getByText('alternative single values')).toBeInTheDocument();
    unmountMonths();

    // Test daysOfWeek
    const { unmount: unmountDays } = setup({ fieldType: 'daysOfWeek' });
    expect(screen.getByText('SUN-SAT')).toBeInTheDocument();
    expect(screen.getByText('alternative single values')).toBeInTheDocument();
    unmountDays();

    // Test other field types don't show alternative values
    const otherFieldTypes = ['minutes', 'hours', 'daysOfMonth'] as const;
    otherFieldTypes.forEach((fieldType) => {
      const { unmount } = setup({ fieldType });
      expect(
        screen.queryByText('alternative single values')
      ).not.toBeInTheDocument();
      unmount();
    });
  });
});

function setup(props: {
  fieldType: 'minutes' | 'hours' | 'daysOfMonth' | 'months' | 'daysOfWeek';
}) {
  return render(<CronScheduleInputPopover {...props} />);
}
