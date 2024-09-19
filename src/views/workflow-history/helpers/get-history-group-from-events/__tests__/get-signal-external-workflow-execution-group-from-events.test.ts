import {
  initiateSignalExternalWorkflowEvent,
  signalExternalWorkflowEvent,
  failSignalExternalWorkflowEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-singal-external-workflow-events';

import type { SignalExternalWorkflowExecutionHistoryEvent } from '../../../workflow-history.types';
import getSignalExternalWorkflowExecutionGroupFromEvents from '../get-signal-external-workflow-execution-group-from-events';

describe('getSignalExternalWorkflowExecutionGroupFromEvents', () => {
  it('should return a group with a correct label', () => {
    const events: SignalExternalWorkflowExecutionHistoryEvent[] = [
      initiateSignalExternalWorkflowEvent,
    ];

    const expectedLabel = `External Workflow Signal: ${initiateSignalExternalWorkflowEvent.signalExternalWorkflowExecutionInitiatedEventAttributes?.signalName}`;

    const group = getSignalExternalWorkflowExecutionGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to true when initiate event is missing', () => {
    const signalEvents: SignalExternalWorkflowExecutionHistoryEvent[] = [
      signalExternalWorkflowEvent,
    ];
    const signalGroup =
      getSignalExternalWorkflowExecutionGroupFromEvents(signalEvents);
    expect(signalGroup.hasMissingEvents).toBe(true);

    const failEvents: SignalExternalWorkflowExecutionHistoryEvent[] = [
      failSignalExternalWorkflowEvent,
    ];
    const failedGroup =
      getSignalExternalWorkflowExecutionGroupFromEvents(failEvents);
    expect(failedGroup.hasMissingEvents).toBe(true);
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
      'Initiated at 08 Sep, 04:24:30 GMT+0',
      'Signaled at 08 Sep, 04:26:10 GMT+0',
    ]);
  });
});
