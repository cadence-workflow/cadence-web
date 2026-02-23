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
import { type EventGroupCategoryFilterValue } from '../../workflow-history-filters-menu.types';
import filterGroupsByCategory from '../filter-groups-by-category';

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
          (g.events.length > 0 &&
            g.events[0].attributes ===
              'workflowExecutionSignaledEventAttributes')
      ),
      WORKFLOW: jest.fn(
        (g) =>
          g.groupType === 'RequestCancelExternalWorkflowExecution' ||
          (g.events.length > 0 &&
            g.groupType === 'Event' &&
            g.events[0].attributes !==
              'workflowExecutionSignaledEventAttributes')
      ),
    },
  })
);

describe(filterGroupsByCategory.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if historyEventTypes is undefined', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: undefined,
    };

    expect(filterGroupsByCategory(mockActivityEventGroup, value)).toBe(true);
    expect(filterGroupsByCategory(mockDecisionEventGroup, value)).toBe(true);
    expect(filterGroupsByCategory(mockTimerEventGroup, value)).toBe(true);
  });

  it('should return true if Activity group type is included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['ACTIVITY'],
    };

    expect(filterGroupsByCategory(mockActivityEventGroup, value)).toBe(true);
  });

  it('should return false if Activity group type is not included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['DECISION', 'TIMER'],
    };

    expect(filterGroupsByCategory(mockActivityEventGroup, value)).toBe(false);
  });

  it('should return true if Decision group type is included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['DECISION'],
    };

    expect(filterGroupsByCategory(mockDecisionEventGroup, value)).toBe(true);
  });

  it('should return false if Decision group type is not included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['ACTIVITY', 'TIMER'],
    };

    expect(filterGroupsByCategory(mockDecisionEventGroup, value)).toBe(false);
  });

  it('should return true if Timer group type is included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['TIMER'],
    };

    expect(filterGroupsByCategory(mockTimerEventGroup, value)).toBe(true);
  });

  it('should return true if ChildWorkflowExecution group type is included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['CHILDWORKFLOW'],
    };

    expect(filterGroupsByCategory(mockChildWorkflowEventGroup, value)).toBe(
      true
    );
  });

  it('should return true if SignalExternalWorkflowExecution group type is included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['SIGNAL'],
    };

    expect(
      filterGroupsByCategory(mockSignalExternalWorkflowEventGroup, value)
    ).toBe(true);
  });

  it('should return true if WorkflowSignaled single event is included in history events and filter is SIGNAL', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['SIGNAL'],
    };

    expect(
      filterGroupsByCategory(
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
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(
      filterGroupsByCategory(
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
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(
      filterGroupsByCategory(mockRequestCancelExternalWorkflowEventGroup, value)
    ).toBe(true);
  });

  it('should return true if Event group type maps to WORKFLOW and is included in historyEventTypes', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(filterGroupsByCategory(mockSingleEventGroup, value)).toBe(true);
  });

  it('should return true when multiple types are included and group type matches one of them', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['ACTIVITY', 'DECISION', 'TIMER'],
    };

    expect(filterGroupsByCategory(mockActivityEventGroup, value)).toBe(true);
    expect(filterGroupsByCategory(mockDecisionEventGroup, value)).toBe(true);
    expect(filterGroupsByCategory(mockTimerEventGroup, value)).toBe(true);
  });

  it('should return false when multiple types are included but group type does not match any of them', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['ACTIVITY', 'DECISION'],
    };

    expect(filterGroupsByCategory(mockTimerEventGroup, value)).toBe(false);
    expect(filterGroupsByCategory(mockChildWorkflowEventGroup, value)).toBe(
      false
    );
    expect(
      filterGroupsByCategory(mockSignalExternalWorkflowEventGroup, value)
    ).toBe(false);
  });

  it('should handle empty historyEventTypes array', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: [],
    };

    expect(filterGroupsByCategory(mockActivityEventGroup, value)).toBe(false);
    expect(filterGroupsByCategory(mockDecisionEventGroup, value)).toBe(false);
    expect(filterGroupsByCategory(mockTimerEventGroup, value)).toBe(false);
  });

  it('should correctly map both RequestCancelExternalWorkflowExecution and Event to WORKFLOW', () => {
    const value: EventGroupCategoryFilterValue = {
      historyEventTypes: ['WORKFLOW'],
    };

    expect(
      filterGroupsByCategory(mockRequestCancelExternalWorkflowEventGroup, value)
    ).toBe(true);
    expect(filterGroupsByCategory(mockSingleEventGroup, value)).toBe(true);

    // Should return false for other types when only WORKFLOW is included
    expect(filterGroupsByCategory(mockActivityEventGroup, value)).toBe(false);
    expect(filterGroupsByCategory(mockDecisionEventGroup, value)).toBe(false);
  });
});
