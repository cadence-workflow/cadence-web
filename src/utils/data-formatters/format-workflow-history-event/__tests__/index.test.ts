import { ZodError } from 'zod';

import logger from '@/utils/logger';
import { allWorkflowEvents } from '@/views/workflow-history/__fixtures__/all-workflow-event-types';

import formatWorkflowHistoryEvent from '..';

jest.mock('@/utils/logger');

describe('formatWorkflowHistoryEvent', () => {
  allWorkflowEvents.forEach((event) => {
    it(`should format workflow ${event.attributes} to match snapshot`, () => {
      expect(formatWorkflowHistoryEvent(event)).toMatchSnapshot();
    });
  });
  it(`should log error if parsing failed`, () => {
    expect(
      //@ts-expect-error pass event with missing fields
      formatWorkflowHistoryEvent({
        attributes: 'workflowExecutionStartedEventAttributes',
      })
    ).toBe(null);
    expect(logger.warn).toHaveBeenCalledWith(
      { cause: expect.any(ZodError) },
      'Failed to format workflow event'
    );
  });
});
