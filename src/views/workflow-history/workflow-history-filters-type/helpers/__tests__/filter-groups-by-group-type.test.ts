import { signalWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
  mockTimerEventGroup,
  mockChildWorkflowEventGroup,
  mockSignalExternalWorkflowEventGroup,
  mockRequestCancelExternalWorkflowEventGroup,
  mockSingleEventGroup,
} from '../../../__fixtures__/workflow-history-event-groups';
import { type WorkflowHistoryFiltersTypeValue } from '../../workflow-history-filters-type.types';
import filterGroupsByGroupType from '../filter-groups-by-group-type';

jest.mock('../../../config/workflow-history-filters-type.config', () => ({
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
}));

describe(filterGroupsByGroupType.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if historyEventTypes is undefined', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: undefined,
    };

    expect(filterGroupsByGroupType(mockActivityEventGroup, value)).toBe(true);
    expect(filterGroupsByGroupType(mockDecisionEventGroup, value)).toBe(true);
    expect(filterGroupsByGroupType(mockTimerEventGroup, value)).toBe(true);
  });

  it('should return true if Activity group type is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['ACTIVITY'],
    };

    expect(filterGroupsByGroupType(mockActivityEventGroup, value)).toBe(true);
  });

  it('should return false if Activity group type is not included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['DECISION', 'TIMER'],
    };

    expect(filterGroupsByGroupType(mockActivityEventGroup, value)).toBe(false);
  });

  it('should return true if Decision group type is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['DECISION'],
    };

    expect(filterGroupsByGroupType(mockDecisionEventGroup, value)).toBe(true);
  });

  it('should return false if Decision group type is not included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['ACTIVITY', 'TIMER'],
    };

    expect(filterGroupsByGroupType(mockDecisionEventGroup, value)).toBe(false);
  });

  it('should return true if Timer group type is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['TIMER'],
    };

    expect(filterGroupsByGroupType(mockTimerEventGroup, value)).toBe(true);
  });

  it('should return true if ChildWorkflowExecution group type is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['CHILDWORKFLOW'],
    };

    expect(filterGroupsByGroupType(mockChildWorkflowEventGroup, value)).toBe(
      true
    );
  });

  it('should return true if SignalExternalWorkflowExecution group type is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['SIGNAL'],
    };

    expect(
      filterGroupsByGroupType(mockSignalExternalWorkflowEventGroup, value)
    ).toBe(true);
  });

  it('should return true if WorkflowSignaled single event is included in history events and filter is SIGNAL', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['SIGNAL'],
    };

    expect(
      filterGroupsByGroupType(
        {
          ...mockSingleEventGroup,
          events: [signalWorkflowExecutionEvent],
          firstEventId: signalWorkflowExecutionEvent.eventId,
        },
        value
      )
    ).toBe(true);
  });

  it('should return false if WorkflowSignaled single event is included in history events and filter is WORKFLOW', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(
      filterGroupsByGroupType(
        {
          ...mockSingleEventGroup,
          events: [signalWorkflowExecutionEvent],
          firstEventId: signalWorkflowExecutionEvent.eventId,
        },
        value
      )
    ).toBe(false);
  });

  it('should return true if RequestCancelExternalWorkflowExecution group type maps to WORKFLOW and is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(
      filterGroupsByGroupType(
        mockRequestCancelExternalWorkflowEventGroup,
        value
      )
    ).toBe(true);
  });

  it('should return true if Event group type maps to WORKFLOW and is included in historyEventTypes', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(filterGroupsByGroupType(mockSingleEventGroup, value)).toBe(true);
  });

  it('should return true when multiple types are included and group type matches one of them', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['ACTIVITY', 'DECISION', 'TIMER'],
    };

    expect(filterGroupsByGroupType(mockActivityEventGroup, value)).toBe(true);
    expect(filterGroupsByGroupType(mockDecisionEventGroup, value)).toBe(true);
    expect(filterGroupsByGroupType(mockTimerEventGroup, value)).toBe(true);
  });

  it('should return false when multiple types are included but group type does not match any of them', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['ACTIVITY', 'DECISION'],
    };

    expect(filterGroupsByGroupType(mockTimerEventGroup, value)).toBe(false);
    expect(filterGroupsByGroupType(mockChildWorkflowEventGroup, value)).toBe(
      false
    );
    expect(
      filterGroupsByGroupType(mockSignalExternalWorkflowEventGroup, value)
    ).toBe(false);
  });

  it('should handle empty historyEventTypes array', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: [],
    };

    expect(filterGroupsByGroupType(mockActivityEventGroup, value)).toBe(false);
    expect(filterGroupsByGroupType(mockDecisionEventGroup, value)).toBe(false);
    expect(filterGroupsByGroupType(mockTimerEventGroup, value)).toBe(false);
  });

  it('should correctly map both RequestCancelExternalWorkflowExecution and Event to WORKFLOW', () => {
    const value: WorkflowHistoryFiltersTypeValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(
      filterGroupsByGroupType(
        mockRequestCancelExternalWorkflowEventGroup,
        value
      )
    ).toBe(true);
    expect(filterGroupsByGroupType(mockSingleEventGroup, value)).toBe(true);

    // Should return false for other types when only WORKFLOW is included
    expect(filterGroupsByGroupType(mockActivityEventGroup, value)).toBe(false);
    expect(filterGroupsByGroupType(mockDecisionEventGroup, value)).toBe(false);
  });
});
