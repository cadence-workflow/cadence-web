import {
  initiateSignalExternalWorkflowEvent,
  signalExternalWorkflowEvent,
  failSignalExternalWorkflowEvent,
} from '../../../__fixtures__/workflow-history-signal-external-workflow-events';
import type { SignalExternalWorkflowExecutionHistoryEvent } from '../../../workflow-history-v2.types';
import getSignalExternalWorkflowExecutionGroupFromEvents from '../get-signal-external-workflow-execution-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe('getSignalExternalWorkflowExecutionGroupFromEvents', () => {
  it('should return a group with a correct label', () => {
    const events: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
    ];

    const expectedLabel = `External Workflow Signal: ${initiateSignalExternalWorkflowEvent.signalExternalWorkflowExecutionInitiatedEventAttributes?.signalName}`;

    const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to true when any event is missing', () => {
    const assertions: Array<{
      name: string;
      events: SignalExternalWorkflowExecutionHistoryEvent[];
      assertionValue: boolean;
    }> = [
      {
        name: 'missingInitiatedEvent',
        events: [signalExternalWorkflowEvent],
        assertionValue: true,
      },
      {
        name: 'missingCloseEvent',
        events: [initiateSignalExternalWorkflowEvent],
        assertionValue: true,
      },
      {
        name: 'completeEvents',
        events: [
          initiateSignalExternalWorkflowEvent,
          signalExternalWorkflowEvent,
        ],
        assertionValue: false,
      },
    ];

    assertions.forEach(({ name, events, assertionValue }) => {
      const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);
      expect([name, group.hasMissingEvents]).toEqual([name, assertionValue]);
    });
  });

  it('should return a group with groupType equal to SignalExternalWorkflowExecution', () => {
    const events: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
      signalExternalWorkflowEvent,
    ];
    const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);
    expect(group.groupType).toBe('SignalExternalWorkflowExecution');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
      signalExternalWorkflowEvent,
      failSignalExternalWorkflowEvent,
    ];
    const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Initiated',
      'Signaled',
      'Failed',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // initiated
    const startEvents: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
    ];
    const startedGroup =
      getSignalExternalWorkflowExecutionGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'WAITING',
    ]);

    // signaled
    const signaledEvents: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
      signalExternalWorkflowEvent,
    ];
    const signaledGroup =
      getSignalExternalWorkflowExecutionGroupFromEvents(signaledEvents);
    expect(signaledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
    ]);

    // faled
    const failedEvents: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
      failSignalExternalWorkflowEvent,
    ];
    const failedGroup =
      getSignalExternalWorkflowExecutionGroupFromEvents(failedEvents);
    expect(failedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'FAILED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const events: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
      signalExternalWorkflowEvent,
    ];
    const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Initiated at 08 Sep, 04:24:30 UTC',
      'Signaled at 08 Sep, 04:26:10 UTC',
    ]);
  });

  it('should return group with closeTimeMs equal to closeEvent timeMs', () => {
    const group = getSignalExternalWorkflowExecutionGroupFromEvents([
      initiateSignalExternalWorkflowEvent,
      signalExternalWorkflowEvent,
    ]);
    expect(group.closeTimeMs).toEqual(1725769570375.7908);
    const groupWithMissingCloseEvent =
      getSignalExternalWorkflowExecutionGroupFromEvents([
        initiateSignalExternalWorkflowEvent,
      ]);
    expect(groupWithMissingCloseEvent.closeTimeMs).toEqual(null);
  });

  it('should include summaryFields for initiated signal external workflow events', () => {
    const events: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
      signalExternalWorkflowEvent,
    ];
    const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);

    // The initiated event should have summaryFields
    const initiatedEventMetadata = group.eventsMetadata.find(
      (metadata) => metadata.label === 'Initiated'
    );
    expect(initiatedEventMetadata?.summaryFields).toEqual([
      'signalName',
      'input',
    ]);

    // Other events should not have summaryFields
    const otherEventsMetadata = group.eventsMetadata.filter(
      (metadata) => metadata.label !== 'Initiated'
    );
    otherEventsMetadata.forEach((metadata) => {
      expect(metadata.summaryFields).toBeUndefined();
    });
  });
});
