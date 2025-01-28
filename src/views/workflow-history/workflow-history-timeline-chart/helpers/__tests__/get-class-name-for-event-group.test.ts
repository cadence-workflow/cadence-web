import { type ClsObjectFor } from '@/hooks/use-styletron-classes';
import {
  mockActivityEventGroup,
  mockTimerEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type WorkflowEventStatus } from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge.types';

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
};

describe(getClassNameForEventGroup.name, () => {
  const tests: Array<{
    groupStatus: WorkflowEventStatus;
    isTimer: boolean;
    expectedClass: string;
  }> = [
    {
      groupStatus: 'ONGOING',
      isTimer: false,
      expectedClass: 'mockOngoing',
    },
    {
      groupStatus: 'CANCELED',
      isTimer: false,
      expectedClass: 'mockNegative',
    },
    {
      groupStatus: 'COMPLETED',
      isTimer: false,
      expectedClass: 'mockCompleted',
    },
    {
      groupStatus: 'FAILED',
      isTimer: false,
      expectedClass: 'mockNegative',
    },
    {
      groupStatus: 'WAITING',
      isTimer: false,
      expectedClass: 'mockWaiting',
    },
    {
      groupStatus: 'ONGOING',
      isTimer: true,
      expectedClass: 'mockTimer',
    },
    {
      groupStatus: 'CANCELED',
      isTimer: true,
      expectedClass: 'mockTimerNegative',
    },
    {
      groupStatus: 'COMPLETED',
      isTimer: true,
      expectedClass: 'mockTimerCompleted',
    },
    {
      groupStatus: 'FAILED',
      isTimer: true,
      expectedClass: 'mockTimerNegative',
    },
    {
      groupStatus: 'WAITING',
      isTimer: true,
      expectedClass: 'mockTimer',
    },
  ];

  tests.forEach((test) => {
    it(`returns the correct class for ${test.groupStatus}${test.isTimer ? ' Timer' : ''}`, () => {
      expect(
        getClassNameForEventGroup(
          {
            ...(test.isTimer ? mockTimerEventGroup : mockActivityEventGroup),
            status: test.groupStatus,
          },
          MOCK_CSS_CLASS_NAMES
        )
      ).toEqual(test.expectedClass);
    });
  });
});
