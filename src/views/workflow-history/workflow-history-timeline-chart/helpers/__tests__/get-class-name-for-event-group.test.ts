import { type ClsObjectFor } from '@/hooks/use-styletron-classes';
import {
  mockActivityEventGroup,
  mockSingleEventGroup,
  mockTimerEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type WorkflowEventStatus } from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import { type cssStyles } from '../../workflow-history-timeline-chart.styles';
import getClassNameForEventGroup from '../get-class-name-for-event-group';

const MOCK_CSS_CLASS_NAMES: ClsObjectFor<typeof cssStyles> = {
  timerWaiting: 'timerWaiting',
  timerCompleted: 'timerCompleted',
  timerNegative: 'timerNegative',
  regularCompleted: 'regularCompleted',
  regularOngoing: 'regularOngoing',
  regularNegative: 'regularNegative',
  regularWaiting: 'regularWaiting',
  singleCompleted: 'singleCompleted',
  singleNegative: 'singleNegative',
  timerWaitingSelected: 'timerWaitingSelected',
  timerCompletedSelected: 'timerCompletedSelected',
  timerNegativeSelected: 'timerNegativeSelected',
  regularCompletedSelected: 'regularCompletedSelected',
  regularOngoingSelected: 'regularOngoingSelected',
  regularNegativeSelected: 'regularNegativeSelected',
  regularWaitingSelected: 'regularWaitingSelected',
  singleCompletedSelected: 'singleCompletedSelected',
  singleNegativeSelected: 'singleNegativeSelected',
};

describe(getClassNameForEventGroup.name, () => {
  const tests: Array<{
    groupStatus: WorkflowEventStatus;
    kind?: 'event' | 'timer';
    isSelected?: boolean;
    expectedClass: string;
  }> = [
    {
      groupStatus: 'ONGOING',
      expectedClass: 'regularOngoing',
    },
    {
      groupStatus: 'CANCELED',
      expectedClass: 'regularNegative',
    },
    {
      groupStatus: 'COMPLETED',
      expectedClass: 'regularCompleted',
    },
    {
      groupStatus: 'FAILED',
      expectedClass: 'regularNegative',
    },
    {
      groupStatus: 'WAITING',
      expectedClass: 'regularWaiting',
    },
    {
      groupStatus: 'ONGOING',
      kind: 'timer',
      expectedClass: 'timerWaiting',
    },
    {
      groupStatus: 'CANCELED',
      kind: 'timer',
      expectedClass: 'timerNegative',
    },
    {
      groupStatus: 'COMPLETED',
      kind: 'timer',
      expectedClass: 'timerCompleted',
    },
    {
      groupStatus: 'FAILED',
      kind: 'timer',
      expectedClass: 'timerNegative',
    },
    {
      groupStatus: 'WAITING',
      kind: 'timer',
      expectedClass: 'timerWaiting',
    },
    {
      groupStatus: 'COMPLETED',
      kind: 'event',
      expectedClass: 'singleCompleted',
    },
    {
      groupStatus: 'CANCELED',
      kind: 'event',
      expectedClass: 'singleNegative',
    },
    {
      groupStatus: 'FAILED',
      kind: 'event',
      expectedClass: 'singleNegative',
    },
    {
      groupStatus: 'ONGOING',
      isSelected: true,
      expectedClass: 'regularOngoingSelected',
    },
    {
      groupStatus: 'CANCELED',
      isSelected: true,
      expectedClass: 'regularNegativeSelected',
    },
    {
      groupStatus: 'COMPLETED',
      isSelected: true,
      expectedClass: 'regularCompletedSelected',
    },
    {
      groupStatus: 'FAILED',
      isSelected: true,
      expectedClass: 'regularNegativeSelected',
    },
    {
      groupStatus: 'WAITING',
      isSelected: true,
      expectedClass: 'regularWaitingSelected',
    },
    {
      groupStatus: 'ONGOING',
      kind: 'timer',
      isSelected: true,
      expectedClass: 'timerWaitingSelected',
    },
    {
      groupStatus: 'CANCELED',
      kind: 'timer',
      isSelected: true,
      expectedClass: 'timerNegativeSelected',
    },
    {
      groupStatus: 'COMPLETED',
      kind: 'timer',
      isSelected: true,
      expectedClass: 'timerCompletedSelected',
    },
    {
      groupStatus: 'FAILED',
      kind: 'timer',
      isSelected: true,
      expectedClass: 'timerNegativeSelected',
    },
    {
      groupStatus: 'WAITING',
      kind: 'timer',
      isSelected: true,
      expectedClass: 'timerWaitingSelected',
    },
    {
      groupStatus: 'COMPLETED',
      kind: 'event',
      isSelected: true,
      expectedClass: 'singleCompletedSelected',
    },
    {
      groupStatus: 'CANCELED',
      kind: 'event',
      isSelected: true,
      expectedClass: 'singleNegativeSelected',
    },
    {
      groupStatus: 'FAILED',
      kind: 'event',
      isSelected: true,
      expectedClass: 'singleNegativeSelected',
    },
  ];

  tests.forEach((test) => {
    it(`returns the correct class for ${test.groupStatus} ${test.kind ?? 'group'}`, () => {
      let group: HistoryEventsGroup = mockActivityEventGroup;
      if (test.kind === 'timer') {
        group = mockTimerEventGroup;
      } else if (test.kind === 'event') {
        group = mockSingleEventGroup;
      }

      expect(
        getClassNameForEventGroup(
          {
            ...group,
            status: test.groupStatus,
          },
          MOCK_CSS_CLASS_NAMES,
          Boolean(test.isSelected)
        )
      ).toEqual(test.expectedClass);
    });
  });
});
