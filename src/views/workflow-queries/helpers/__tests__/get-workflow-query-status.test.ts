import { type QueryStatus } from '@tanstack/react-query';

import { type WorkflowQueryStatus } from '../../workflow-queries-tile/workflow-queries-tile.types';
import getWorkflowQueryStatus from '../get-workflow-query-status';

describe(getWorkflowQueryStatus.name, () => {
  const tests: Array<{
    name: string;
    status: QueryStatus;
    isFetching: boolean;
    expected: WorkflowQueryStatus;
  }> = [
    {
      name: 'returns fetching if isFetching is true',
      status: 'pending',
      isFetching: true,
      expected: 'fetching',
    },
    {
      name: 'returns success if query status is success',
      status: 'success',
      isFetching: false,
      expected: 'success',
    },
    {
      name: 'returns error if query status is error',
      status: 'error',
      isFetching: false,
      expected: 'error',
    },
    {
      name: 'returns pending if query status is pending',
      status: 'pending',
      isFetching: false,
      expected: 'pending',
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      expect(
        getWorkflowQueryStatus({
          queryStatus: test.status,
          isFetching: test.isFetching,
        })
      ).toEqual(test.expected);
    });
  });
});
