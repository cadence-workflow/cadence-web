import React from 'react';

import { render } from '@/test-utils/rtl';

import { type WorkflowQueryStatus } from '../../workflow-queries-tile/workflow-queries-tile.types';
import WorkflowQueriesStatusIcon from '../workflow-queries-status-icon';

describe(WorkflowQueriesStatusIcon.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    status: WorkflowQueryStatus;
  }> = [
    {
      name: 'should render correctly for fetching status',
      status: 'fetching',
    },
    {
      name: 'should render correctly for success status',
      status: 'success',
    },
    {
      name: 'should render correctly for error status',
      status: 'error',
    },
    {
      name: 'should render null for pending status',
      status: 'pending',
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      const { container } = render(
        <WorkflowQueriesStatusIcon status={test.status} />,
        { isSnapshotTest: true }
      );

      expect(container).toMatchSnapshot();
    });
  });
});
