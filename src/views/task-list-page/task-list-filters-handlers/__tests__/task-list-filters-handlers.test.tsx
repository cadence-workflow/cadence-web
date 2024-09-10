import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import { type TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';

import TaskListFiltersHandlers from '../task-list-filters-handlers';
import { TASK_LIST_HANDLERS_OPTIONS } from '../task-list-filters-handlers.constants';

describe(TaskListFiltersHandlers.name, () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays all the options in the select component', () => {
    setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    TASK_LIST_HANDLERS_OPTIONS.forEach((opt) =>
      expect(screen.getByText(opt.label)).toBeInTheDocument()
    );
  });

  it('calls the setValue function when an option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const runningOption = screen.getByText('Activity');
    act(() => {
      fireEvent.click(runningOption);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      handlerType: 'TASK_LIST_TYPE_ACTIVITY',
    });
  });

  it('calls the setValue function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      handlerType: 'TASK_LIST_TYPE_ACTIVITY',
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({ handlerType: undefined });
  });
});

function setup({ handlerType }: { handlerType?: TaskListType }) {
  const mockSetValue = jest.fn();
  render(
    <TaskListFiltersHandlers
      value={{
        handlerType: handlerType ?? undefined,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
