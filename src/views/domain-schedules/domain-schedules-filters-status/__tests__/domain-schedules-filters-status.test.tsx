import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import DomainSchedulesFiltersStatus from '../domain-schedules-filters-status';
import { DOMAIN_SCHEDULES_STATUS_LABELS_MAP } from '../domain-schedules-filters-status.constants';
import { type DomainSchedulesStatus } from '../domain-schedules-filters-status.types';

describe(DomainSchedulesFiltersStatus.name, () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays all status options in the select component', () => {
    setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    Object.values(DOMAIN_SCHEDULES_STATUS_LABELS_MAP).forEach((label) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );
  });

  it('calls setValue when a status option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const pausedOption = screen.getByText(
      DOMAIN_SCHEDULES_STATUS_LABELS_MAP.PAUSED
    );
    act(() => {
      fireEvent.click(pausedOption);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      schedulesStatus: 'PAUSED',
    });
  });

  it('calls setValue with undefined when the status is cleared', () => {
    const { mockSetValue } = setup({ schedulesStatus: 'PAUSED' });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({ schedulesStatus: undefined });
  });
});

function setup({
  schedulesStatus,
}: {
  schedulesStatus?: DomainSchedulesStatus;
}) {
  const mockSetValue = jest.fn();
  render(
    <DomainSchedulesFiltersStatus
      value={{ schedulesStatus }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
