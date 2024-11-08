import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type WorkflowQueryStatus } from '../../workflow-queries-tile/workflow-queries-tile.types';
import WorkflowQueriesStatusIcon from '../workflow-queries-status-icon';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdWarning: () => <div>Warning Icon</div>,
  MdCheckCircle: () => <div>Circle Check Icon</div>,
}));

jest.mock('baseui/spinner', () => ({
  Spinner: jest.fn(() => <div>Spinner</div>),
}));

describe(WorkflowQueriesStatusIcon.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    status: WorkflowQueryStatus;
    expected: string | null;
  }> = [
    {
      name: 'should render correctly for loading status',
      status: 'loading',
      expected: 'Spinner',
    },
    {
      name: 'should render correctly for success status',
      status: 'success',
      expected: 'Circle Check Icon',
    },
    {
      name: 'should render correctly for error status',
      status: 'error',
      expected: 'Warning Icon',
    },
    {
      name: 'should render null for idle status',
      status: 'idle',
      expected: null,
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      render(<WorkflowQueriesStatusIcon status={test.status} />);

      if (test.expected) {
        expect(screen.getByText(test.expected)).toBeInTheDocument();
      }
    });
  });
});
