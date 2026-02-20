import {
  workflowSignaledEvent,
  workflowSignaledEvents,
} from '../../../__fixtures__/workflow-history-workflow-signaled-events';
import type { WorkflowSignaledHistoryEvent } from '../../../workflow-history-v2.types';
import getWorkflowSignaledGroupFromEvents from '../get-workflow-signaled-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe(getWorkflowSignaledGroupFromEvents.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a group with a proper label including signal name', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    const signalName =
      workflowSignaledEvent.workflowExecutionSignaledEventAttributes.signalName;
    expect(group.label).toBe(`Workflow Signaled: ${signalName}`);
  });

  it('should return a group with groupType equal to WorkflowSignaled', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.groupType).toBe('WorkflowSignaled');
  });

  it('should return a group with hasMissingEvents equal to false', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.hasMissingEvents).toBe(false);
  });

  it('should return group eventsMetadata with correct labels', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Signaled',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.eventsMetadata[0].timeLabel).toMatch(/^Signaled at 27 Aug/);
  });

  it('should include summaryFields for workflow signaled event', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.eventsMetadata[0].summaryFields).toEqual(['input']);
  });

  it('should return a group with COMPLETED status', () => {
    const group = getWorkflowSignaledGroupFromEvents(workflowSignaledEvents);

    expect(group.status).toBe('COMPLETED');
  });

  it('should handle event without signal name', () => {
    const eventWithoutSignalName: WorkflowSignaledHistoryEvent = {
      ...workflowSignaledEvent,
      workflowExecutionSignaledEventAttributes: {
        ...workflowSignaledEvent.workflowExecutionSignaledEventAttributes,
        signalName: '',
      },
    };

    const group = getWorkflowSignaledGroupFromEvents([eventWithoutSignalName]);

    expect(group.label).toBe('Workflow Signaled: Unknown Signal');
  });
});
