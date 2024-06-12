import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import mapWorkflowStatusToStatusCode from '../map-workflow-status-to-status-code';

describe('mapWorkflowStatusToStatusCode', () => {
  const tests: Array<{
    input: WorkflowStatus;
    output: number;
  }> = [
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      output: 1,
    },
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
      output: 2,
    },
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
      output: 3,
    },
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
      output: 4,
    },
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
      output: 5,
    },
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
      output: 6,
    },
    {
      input: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      output: 0,
    },
  ];

  tests.forEach(({ input, output }) =>
    it(`returns ${output} for ${WORKFLOW_STATUS_NAMES[input]} status`, () => {
      expect(mapWorkflowStatusToStatusCode(input)).toEqual(output);
    })
  );
});
