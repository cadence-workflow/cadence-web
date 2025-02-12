// Copyright (c) 2017-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import moment from 'moment';
import { summarizeEvents } from './summarize-events';
import { WORKFLOW_EVENT_TYPE } from '~constants';
import { shortName } from '~helpers';

export default function({ clusterName, historyEvents }) {
  const events = [];
  const hash = {};

  const add = i => {
    hash[i.id] = i;
    events.push(i);

    return i;
  };

  const summarizeEventsMap = summarizeEvents({ clusterName });

  const assignEnd = (item, end) => {
    // eslint-disable-next-line no-param-reassign
    item.ongoing = false;
    // eslint-disable-next-line no-param-reassign
    item.end = moment(end);
  };

  historyEvents.forEach(e => {
    if (e.eventType.startsWith('ActivityTask')) {
      const scheduledEvent =
        'activityId' in e.details
          ? e
          : historyEvents[e.details.scheduledEventId - 1];
      const { activityId } = scheduledEvent.details;
      let item = hash[`activity${activityId}`];

      if (!item) {
        item = add({
          id: `activity${activityId}`,
          className: 'activity',
          eventIds: [e.eventId],
          start: moment(scheduledEvent.timestamp),
          ongoing: true,
          content: `Activity ${activityId}: ${shortName(
            scheduledEvent.details.activityType &&
              scheduledEvent.details.activityType.name
          )}`,
          details: {
            input: e.details.input,
            scheduleToStartTimeoutSeconds:
              e.details.scheduleToStartTimeoutSeconds,
            scheduleToCloseTimeoutSeconds:
              e.details.scheduleToCloseTimeoutSeconds,
          },
        });
      } else {
        item.eventIds.push(e.eventId);

        if (e.eventType !== WORKFLOW_EVENT_TYPE.ActivityTaskStarted) {
          Object.assign(
            item.details,
            summarizeEventsMap[e.eventType](e.details)
          );
        }
      }

      if (
        e.eventType !== WORKFLOW_EVENT_TYPE.ActivityTaskScheduled &&
        e.eventType !== WORKFLOW_EVENT_TYPE.ActivityTaskStarted
      ) {
        assignEnd(item, e.timestamp);
        item.className = `activity ${e.eventType
          .replace('ActivityTask', '')
          .toLowerCase()}`;
      }
    } else if (e.eventType.includes('ChildWorkflowExecution')) {
      const initiatedEvent =
        'initiatedEventId' in e.details
          ? historyEvents[e.details.initiatedEventId - 1]
          : e;
      const initiatedEventId = initiatedEvent.eventId;
      let item = hash[`childWf${initiatedEventId}`];

      if (!item) {
        item = add({
          id: `childWf${initiatedEventId}`,
          className: 'child-workflow',
          eventIds: [e.eventId],
          start: moment(initiatedEvent.timestamp),
          ongoing: true,
          content: `Child Workflow: ${shortName(e.details.workflowType.name)}`,
          details: {
            input: e.details.input,
          },
        });
      } else {
        item.eventIds.push(e.eventId);

        if (e.eventType in summarizeEventsMap) {
          const summary = summarizeEventsMap[e.eventType](e.details);

          if (
            !item.titleLink &&
            summary.Workflow &&
            summary.Workflow.routeLink
          ) {
            item.titleLink = summary.Workflow.routeLink;
          }

          Object.assign(item.details);
        }
      }

      if (
        e.eventType !==
          WORKFLOW_EVENT_TYPE.StartChildWorkflowExecutionInitiated &&
        e.eventType !== WORKFLOW_EVENT_TYPE.ChildWorkflowExecutionStarted
      ) {
        assignEnd(item, e.timestamp);
        item.className = `child-workflow ${e.eventType
          .replace('ChildWorkflowExecution', '')
          .toLowerCase()}`;
      }
    } else if (e.eventType === WORKFLOW_EVENT_TYPE.TimerStarted) {
      add({
        id: `timer${e.details.timerId}`,
        className: 'timer',
        eventIds: [e.eventId],
        start: moment(e.timestamp),
        end: moment(e.timestamp).add(
          e.details.startToFireTimeoutSeconds,
          'seconds'
        ),
        content: `Timer ${e.details.timerId} (${moment
          .duration(e.details.startToFireTimeoutSeconds, 'seconds')
          .format()})`,
      });
    } else if (e.eventType === WORKFLOW_EVENT_TYPE.TimerCanceled) {
      const timerStartedEvent = hash[`timer${e.details.timerId}`];

      if (timerStartedEvent) {
        timerStartedEvent.eventIds.push(e.eventId);
      }
    } else if (e.eventType === WORKFLOW_EVENT_TYPE.TimerFired) {
      const timerStartedEvent = hash[`timer${e.details.timerId}`];

      if (timerStartedEvent) {
        timerStartedEvent.eventIds.push(e.eventId);
      }
    } else if (e.eventType === WORKFLOW_EVENT_TYPE.MarkerRecorded) {
      const markerName =
        e.details.markerName !== undefined
          ? e.details.markerName.toLowerCase()
          : '';

      add({
        id: `marker${e.eventId}`,
        className: `marker marker-${markerName}`,
        eventIds: [e.eventId],
        start: moment(e.timestamp),
        content:
          {
            Version: 'Version Marker',
            SideEffect: 'Side Effect',
            LocalActivity: 'Local Activity',
          }[e.details.markerName] || `${e.details.markerName} Marker`,
        details: summarizeEventsMap[WORKFLOW_EVENT_TYPE.MarkerRecorded](
          e.details
        ),
      });
    } else if (e.eventType === WORKFLOW_EVENT_TYPE.WorkflowExecutionSignaled) {
      add({
        id: `signal${e.eventId}`,
        className: 'signal',
        eventIds: [e.eventId],
        start: moment(e.timestamp),
        content: 'Workflow Signaled',
        details: {
          input: e.details.input,
        },
      });
    } else if (
      e.eventType ===
      WORKFLOW_EVENT_TYPE.SignalExternalWorkflowExecutionInitiated
    ) {
      add({
        id: `extsignal${e.eventId}`,
        className: 'external-signal',
        eventIds: [e.eventId],
        start: moment(e.timestamp),
        content: 'External Workflow Signaled',
        details: summarizeEventsMap[
          WORKFLOW_EVENT_TYPE.SignalExternalWorkflowExecutionInitiated
        ](e.details),
      });
    } else if (
      e.eventType === WORKFLOW_EVENT_TYPE.ExternalWorkflowExecutionSignaled
    ) {
      const initiatedEvent = hash[`extsignal${e.eventId}`];

      if (initiatedEvent) {
        initiatedEvent.eventIds.push(e.eventId);
        // TODO - code will break as item is not defined.
        // assignEnd(item, e.timestamp);
      }
    } else if (
      e.eventType === WORKFLOW_EVENT_TYPE.DecisionTaskFailed ||
      e.eventType === WORKFLOW_EVENT_TYPE.DecisionTaskTimedOut
    ) {
      add({
        id: `decision${e.eventId}`,
        className: `decision ${e.eventType
          .replace('DecisionTask', '')
          .toLowerCase()}`,
        eventIds: [e.eventId],
        start: moment(e.timestamp),
        content: e.eventType,
        details: e.details,
      });
    }
  });

  return events;
}
