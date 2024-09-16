import { render, screen } from '@/test-utils/rtl';

import { mockTaskList } from '../../__fixtures__/mock-task-list';
import { mockTaskListPageQueryParamsValues } from '../../__fixtures__/mock-task-list-page-query-params-values';
import TaskListWorkersTable from '../task-list-workers-table';

jest.mock('../helpers/filter-workers', () => ({
  __esModule: true,
  default: jest.fn(({ workers }) => workers),
}));

jest.mock('@/utils/sort-by', () => ({
  __esModule: true,
  default: jest.fn((v) => v),
}));

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockTaskListPageQueryParamsValues, mockSetQueryParams])
);

describe(TaskListWorkersTable.name, () => {
  it('renders workers without error', () => {
    render(<TaskListWorkersTable taskList={mockTaskList} />);

    expect(screen.getByText(/poller-1/)).toBeInTheDocument;
    expect(screen.getByText(/poller-2/)).toBeInTheDocument;
    expect(screen.getByText(/poller-3/)).toBeInTheDocument;
  });

  it('renders the end message if there are no workers', () => {
    render(
      <TaskListWorkersTable taskList={{ ...mockTaskList, workers: [] }} />
    );

    expect(screen.getByText('No workers')).toBeInTheDocument;
  });
});
