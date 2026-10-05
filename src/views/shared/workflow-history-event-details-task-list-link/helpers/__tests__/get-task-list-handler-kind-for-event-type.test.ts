import getTaskListHandlerKindForEventType from '../get-task-list-handler-kind-for-event-type';

describe(getTaskListHandlerKindForEventType.name, () => {
  it('maps activity scheduled events to activity handlers', () => {
    expect(getTaskListHandlerKindForEventType('ActivityTaskScheduled')).toBe(
      'activity'
    );
  });

  it('maps decision-related events to decision handlers', () => {
    expect(getTaskListHandlerKindForEventType('DecisionTaskScheduled')).toBe(
      'decision'
    );
    expect(getTaskListHandlerKindForEventType('WorkflowExecutionStarted')).toBe(
      'decision'
    );
    expect(
      getTaskListHandlerKindForEventType('WorkflowExecutionContinuedAsNew')
    ).toBe('decision');
    expect(
      getTaskListHandlerKindForEventType('StartChildWorkflowExecutionInitiated')
    ).toBe('decision');
  });

  it('defaults to workers when event type is missing or unknown', () => {
    expect(getTaskListHandlerKindForEventType(undefined)).toBe('workers');
    expect(getTaskListHandlerKindForEventType('ActivityTaskStarted')).toBe(
      'workers'
    );
  });
});
