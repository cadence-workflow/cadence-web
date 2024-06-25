// Copyright (c) 2017-2024 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import type { Props as WorkflowStatusTagProps } from '@/views/shared/workflow-status-tag/workflow-status-tag-icon/workflow-status-tag-icon.types';

import getWorkflowIsCompleted from './get-workflow-is-completed';

//TODO: @assem.hafez add type form response to lastEvent
const getWorkflowStatusTagProps = (
  lastEvent: any,
  workflowInfo?: { cluster: string; workflowId: string; domain: string }
): Pick<WorkflowStatusTagProps, 'status' | 'link'> => {
  const isCompleted = getWorkflowIsCompleted(lastEvent?.attributes);

  if (!lastEvent || !isCompleted)
    return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID' };

  switch (lastEvent?.attributes) {
    case 'workflowExecutionFailedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' };
    case 'workflowExecutionCanceledEventAttributes':
    case 'workflowExecutionCancelRequestedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED' };
    case 'workflowExecutionCompletedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED' };
    case 'workflowExecutionTerminatedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED' };
    case 'workflowExecutionContinuedAsNewEventAttributes':
      const { workflowId, domain, cluster } = workflowInfo || {};
      const runId =
        lastEvent.workflowExecutionContinuedAsNewEventAttributes
          ?.newExecutionRunId;
      return {
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
        link:
          domain && runId && workflowId && cluster
            ? `/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}`
            : undefined,
      };
    case 'workflowExecutionTimedOutEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT' };
    default:
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID' };
  }
};

export default getWorkflowStatusTagProps;
