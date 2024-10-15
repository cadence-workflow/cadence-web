// Import the function to be tested
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { continueAsNewWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import getWorkflowIsCompleted from '../get-workflow-is-completed';
import getWorkflowStatusTagProps from '../get-workflow-status-tag-props';

jest.mock('../get-workflow-is-completed');

const mockedGetWorkflowIsCompleted =
  getWorkflowIsCompleted as jest.MockedFunction<typeof getWorkflowIsCompleted>;

describe('getWorkflowStatusTagProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return INVALID status if lastEvent is not provided', () => {
    expect(getWorkflowStatusTagProps(null)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
  });

  it('should return INVALID (running) status if workflow is not completed', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(false);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      attributes: 'workflowExecutionStartedEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
  });

  it('should return FAILED status if workflow failed', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      attributes: 'workflowExecutionFailedEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
    });
  });

  it('should return CANCELED status if workflow canceled or cancel requested', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      attributes: 'workflowExecutionCanceledEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
    });

    lastEvent.attributes = 'workflowExecutionCancelRequestedEventAttributes';

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
    });
  });

  it('should return COMPLETED status if workflow completed', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      attributes: 'workflowExecutionCompletedEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });
  });

  it('should return TERMINATED status if workflow terminated', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      attributes: 'workflowExecutionTerminatedEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
    });
  });

  it('should return CONTINUED_AS_NEW status and link if workflow continued as new', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = continueAsNewWorkflowExecutionEvent;
    const newRunId =
      continueAsNewWorkflowExecutionEvent
        .workflowExecutionContinuedAsNewEventAttributes.newExecutionRunId;

    const workflowInfo = {
      cluster: 'testCluster',
      workflowId: 'testWorkflowId',
      domain: 'testDomain',
    };

    expect(getWorkflowStatusTagProps(lastEvent, workflowInfo)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
      link: `/domains/testDomain/testCluster/workflows/testWorkflowId/${newRunId}`,
    });
  });

  it('should return CONTINUED_AS_NEW status with undefined link if workflowInfo is incomplete', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = continueAsNewWorkflowExecutionEvent;

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
      link: undefined,
    });
  });

  it('should return TIMED_OUT status if workflow timed out', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      attributes: 'workflowExecutionTimedOutEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
    });
  });

  it('should return INVALID status for unrecognized attributes', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent: Pick<HistoryEvent, 'attributes'> = {
      // @ts-expect-error testing invalid attributes
      attributes: 'someUnknownEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
  });
});
