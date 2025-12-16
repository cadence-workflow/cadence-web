import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
  mockTimerEventGroup,
  mockChildWorkflowEventGroup,
  mockSignalExternalWorkflowEventGroup,
  mockRequestCancelExternalWorkflowEventGroup,
  mockSingleEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { signalWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import getEventGroupFilteringType from '../get-event-group-filtering-type';

jest.mock(
  '@/views/workflow-history/config/workflow-history-filters-type.config',
  () => ({
    ACTIVITY: 'Activity',
    CHILDWORKFLOW: 'ChildWorkflowExecution',
    DECISION: 'Decision',
    TIMER: 'Timer',
    SIGNAL: jest.fn(
      (g) =>
        g.groupType === 'SignalExternalWorkflowExecution' ||
        g.events[0].attributes === 'workflowExecutionSignaledEventAttributes'
    ),
    WORKFLOW: jest.fn(
      (g) =>
        g.groupType === 'RequestCancelExternalWorkflowExecution' ||
        (g.groupType === 'Event' &&
          g.events[0].attributes !== 'workflowExecutionSignaledEventAttributes')
    ),
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

  it('should return SIGNAL for Event group type with workflowExecutionSignaledEventAttributes', () => {
    const group = {
      ...mockSingleEventGroup,
      events: [signalWorkflowExecutionEvent],
      firstEventId: signalWorkflowExecutionEvent.eventId,
    };

    expect(getEventGroupFilteringType(group)).toBe('SIGNAL');
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
