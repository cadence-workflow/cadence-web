import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
  mockTimerEventGroup,
  mockChildWorkflowEventGroup,
  mockSignalExternalWorkflowEventGroup,
  mockRequestCancelExternalWorkflowEventGroup,
  mockSingleEventGroup,
  mockWorkflowSignaledEventGroup,
} from '../../../__fixtures__/workflow-history-event-groups';
import getEventGroupFilteringType from '../get-event-group-filtering-type';

jest.mock(
  '../../../config/workflow-history-event-group-category-filters.config',
  () => ({
    __esModule: true,
    default: {
      ACTIVITY: 'Activity',
      CHILDWORKFLOW: 'ChildWorkflowExecution',
      DECISION: 'Decision',
      TIMER: 'Timer',
      SIGNAL: jest.fn(
        (g) =>
          g.groupType === 'SignalExternalWorkflowExecution' ||
          g.groupType === 'WorkflowSignaled'
      ),
      WORKFLOW: jest.fn(
        (g) =>
          g.groupType === 'RequestCancelExternalWorkflowExecution' ||
          g.groupType === 'Event'
      ),
    },
  })
);

describe(getEventGroupFilteringType.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return ACTIVITY for Activity group type', () => {
    expect(getEventGroupFilteringType(mockActivityEventGroup)).toBe('ACTIVITY');
  });

  it('should return DECISION for Decision group type', () => {
    expect(getEventGroupFilteringType(mockDecisionEventGroup)).toBe('DECISION');
  });

  it('should return TIMER for Timer group type', () => {
    expect(getEventGroupFilteringType(mockTimerEventGroup)).toBe('TIMER');
  });

  it('should return CHILDWORKFLOW for ChildWorkflowExecution group type', () => {
    expect(getEventGroupFilteringType(mockChildWorkflowEventGroup)).toBe(
      'CHILDWORKFLOW'
    );
  });

  it('should return SIGNAL for SignalExternalWorkflowExecution group type', () => {
    expect(
      getEventGroupFilteringType(mockSignalExternalWorkflowEventGroup)
    ).toBe('SIGNAL');
  });

  it('should return SIGNAL for WorkflowSignaled group type', () => {
    expect(getEventGroupFilteringType(mockWorkflowSignaledEventGroup)).toBe(
      'SIGNAL'
    );
  });

  it('should return WORKFLOW for RequestCancelExternalWorkflowExecution group type', () => {
    expect(
      getEventGroupFilteringType(mockRequestCancelExternalWorkflowEventGroup)
    ).toBe('WORKFLOW');
  });

  it('should return WORKFLOW for Event group type with non-signal attributes', () => {
    expect(getEventGroupFilteringType(mockSingleEventGroup)).toBe('WORKFLOW');
  });
});
