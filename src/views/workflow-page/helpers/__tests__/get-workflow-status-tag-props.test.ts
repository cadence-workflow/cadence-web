// Import the function to be tested
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

  it('should return RUNNING status if workflow is not completed', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(false);
    const lastEvent = { attributes: 'someRunningEventAttributes' };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_STATUS_RUNNING',
    });
  });

  it('should return FAILED status if workflow failed', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = { attributes: 'workflowExecutionFailedEventAttributes' };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
    });
  });

  it('should return CANCELED status if workflow canceled or cancel requested', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = {
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
    const lastEvent = {
      attributes: 'workflowExecutionCompletedEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });
  });

  it('should return TERMINATED status if workflow terminated', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = {
      attributes: 'workflowExecutionTerminatedEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
    });
  });

  it('should return CONTINUED_AS_NEW status and link if workflow continued as new', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = {
      attributes: 'workflowExecutionContinuedAsNewEventAttributes',
      workflowExecutionContinuedAsNewEventAttributes: {
        newExecutionRunId: 'newRunId',
      },
    };
    const workflowInfo = {
      cluster: 'testCluster',
      workflowId: 'testWorkflowId',
      domain: 'testDomain',
    };

    expect(getWorkflowStatusTagProps(lastEvent, workflowInfo)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
      link: '/domains/testDomain/testCluster/workflows/testWorkflowId/newRunId',
    });
  });

  it('should return CONTINUED_AS_NEW status with undefined link if workflowInfo is incomplete', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = {
      attributes: 'workflowExecutionContinuedAsNewEventAttributes',
      workflowExecutionContinuedAsNewEventAttributes: {
        newExecutionRunId: 'newRunId',
      },
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
      link: undefined,
    });
  });

  it('should return TIMED_OUT status if workflow timed out', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = {
      attributes: 'workflowExecutionTimedOutEventAttributes',
    };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
    });
  });

  it('should return INVALID status for unrecognized attributes', () => {
    mockedGetWorkflowIsCompleted.mockReturnValue(true);
    const lastEvent = { attributes: 'someUnknownEventAttributes' };

    expect(getWorkflowStatusTagProps(lastEvent)).toEqual({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
  });
});
