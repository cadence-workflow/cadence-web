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
  timer: 'mockTimer',
  timerCompleted: 'mockTimerCompleted',
  timerNegative: 'mockTimerNegative',
  completed: 'mockCompleted',
  ongoing: 'mockOngoing',
  negative: 'mockNegative',
  waiting: 'mockWaiting',
  singleCompleted: 'mockSingleCompleted',
  singleNegative: 'mockSingleNegative',
};

describe(getClassNameForEventGroup.name, () => {
  const tests: Array<{
    groupStatus: WorkflowEventStatus;
    kind?: 'event' | 'timer';
    expectedClass: string;
  }> = [
    {
      groupStatus: 'ONGOING',
      expectedClass: 'mockOngoing',
    },
    {
      groupStatus: 'CANCELED',
      expectedClass: 'mockNegative',
    },
    {
      groupStatus: 'COMPLETED',
      expectedClass: 'mockCompleted',
    },
    {
      groupStatus: 'FAILED',
      expectedClass: 'mockNegative',
    },
    {
      groupStatus: 'WAITING',
      expectedClass: 'mockWaiting',
    },
    {
      groupStatus: 'ONGOING',
      kind: 'timer',
      expectedClass: 'mockTimer',
    },
    {
      groupStatus: 'CANCELED',
      kind: 'timer',
      expectedClass: 'mockTimerNegative',
    },
    {
      groupStatus: 'COMPLETED',
      kind: 'timer',
      expectedClass: 'mockTimerCompleted',
    },
    {
      groupStatus: 'FAILED',
      kind: 'timer',
      expectedClass: 'mockTimerNegative',
    },
    {
      groupStatus: 'WAITING',
      kind: 'timer',
      expectedClass: 'mockTimer',
    },
    {
      groupStatus: 'COMPLETED',
      kind: 'event',
      expectedClass: 'mockSingleCompleted',
    },
    {
      groupStatus: 'CANCELED',
      kind: 'event',
      expectedClass: 'mockSingleNegative',
    },
    {
      groupStatus: 'FAILED',
      kind: 'event',
      expectedClass: 'mockSingleNegative',
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
          MOCK_CSS_CLASS_NAMES
        )
      ).toEqual(test.expectedClass);
    });
  });
});
