import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import TaskListError from '../task-list-error';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
    taskListName: 'test-tasklist',
  }),
}));

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

describe(TaskListError.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error page correctly', () => {
    render(
      <TaskListError
        error={new Error('something bad happened')}
        reset={() => {}}
      />
    );
    expect(
      screen.getByText('Failed to tasks list "test-tasklist"')
    ).toBeInTheDocument();
  });

  it('renders "not found" error page correctly', () => {
    render(
      <TaskListError
        error={new RequestError('Could not find domain', 404)}
        reset={() => {}}
      />
    );
    expect(
      screen.getByText('The task list "test-tasklist" was not found')
    ).toBeInTheDocument();
  });

  it('renders "forbidden" error page correctly', () => {
    render(
      <TaskListError
        error={new RequestError('Forbidden', 403)}
        reset={() => {}}
      />
    );
    expect(
      screen.getByText('Access denied for tasklist "test-tasklist"')
    ).toBeInTheDocument();
  });
});
