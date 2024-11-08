import { type QueryStatus } from '@tanstack/react-query';

import { type WorkflowQueryStatus } from '../workflow-queries-tile/workflow-queries-tile.types';

export default function getWorkflowQueryStatus({
  queryStatus,
  isFetching,
}: {
  queryStatus: QueryStatus;
  isFetching: boolean;
}): WorkflowQueryStatus {
  if (isFetching) {
    return 'loading';
  }

  switch (queryStatus) {
    case 'error':
      return 'error';
    case 'success':
      return 'success';
    case 'pending':
      return 'idle';
  }
}
