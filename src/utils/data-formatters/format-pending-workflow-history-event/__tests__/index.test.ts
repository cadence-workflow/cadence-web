import { ZodError } from 'zod';

import logger from '@/utils/logger';
import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskScheduleEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';

import formatPendingWorkflowHistoryEvent from '..';

jest.mock('@/utils/logger');

const pendingEvents = [
  pendingActivityTaskStartEvent,
  pendingDecisionTaskScheduleEvent,
];
describe('formatWorkflowHistoryEvent', () => {
  pendingEvents.forEach((event) => {
    it(`should format workflow ${event.attributes} to match snapshot`, () => {
      expect(formatPendingWorkflowHistoryEvent(event)).toMatchSnapshot();
    });
  });
  it(`should log error if parsing failed`, () => {
    expect(
      //@ts-expect-error pass event with missing fields
      formatPendingWorkflowHistoryEvent({
        attributes: 'pendingActivityTaskStartEventAttributes',
      })
    ).toBe(null);
    expect(logger.warn).toHaveBeenCalledWith(
      { cause: expect.any(ZodError) },
      'Failed to format workflow pending event'
    );
  });
});
