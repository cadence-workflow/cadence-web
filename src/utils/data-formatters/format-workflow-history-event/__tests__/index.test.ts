import { ZodError } from 'zod';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';
import { allWorkflowEvents } from '@/views/workflow-history/__fixtures__/all-workflow-event-types';
import { failWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import formatWorkflowHistoryEvent from '..';

jest.mock('@/utils/logger');

const semaphoreEventBaseFields = {
  eventId: '10',
  eventTime: { seconds: '1726747515', nanos: 0 },
  version: '1',
  taskId: '1',
} as const;

const semaphoreEvents: HistoryEvent[] = [
  {
    ...semaphoreEventBaseFields,
    attributes: 'semaphoreAcquireInitiatedEventAttributes',
    semaphoreAcquireInitiatedEventAttributes: {
      semaphoreName: 'test-semaphore',
      waitTimeout: null,
      decisionTaskCompletedEventId: '4',
    },
  },
  {
    ...semaphoreEventBaseFields,
    attributes: 'semaphoreAcquiredEventAttributes',
    semaphoreAcquiredEventAttributes: {
      tokenId: 1,
      initiatedEventId: '10',
    },
  },
  {
    ...semaphoreEventBaseFields,
    attributes: 'semaphoreAcquireFailedEventAttributes',
    semaphoreAcquireFailedEventAttributes: {
      cause: 'SEMAPHORE_ACQUIRE_FAILED_CAUSE_NOT_FOUND',
      initiatedEventId: '10',
    },
  },
  {
    ...semaphoreEventBaseFields,
    attributes: 'semaphoreReleasedEventAttributes',
    semaphoreReleasedEventAttributes: {
      tokenId: 1,
      initiatedEventId: '10',
      decisionTaskCompletedEventId: '12',
    },
  },
];

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
      { error: expect.any(ZodError) },
      'Failed to format workflow event'
    );
  });

  it('should format a failure that has options set', () => {
    const event: HistoryEvent = {
      ...failWorkflowExecutionEvent,
      workflowExecutionFailedEventAttributes: {
        ...failWorkflowExecutionEvent.workflowExecutionFailedEventAttributes,
        failure: {
          reason: 'cadenceInternal:Generic',
          details: '',
          options: {
            failureCategory: 'FAILURE_CATEGORY_POLL',
            nextRetryInterval: { seconds: '5', nanos: 0 },
          },
        },
      },
    };

    expect(formatWorkflowHistoryEvent(event)).toEqual(
      expect.objectContaining({
        eventType: 'WorkflowExecutionFailed',
        reason: 'cadenceInternal:Generic',
      })
    );
  });

  it('should fail to format a failure with an unknown failure category', () => {
    const event: HistoryEvent = {
      ...failWorkflowExecutionEvent,
      workflowExecutionFailedEventAttributes: {
        ...failWorkflowExecutionEvent.workflowExecutionFailedEventAttributes,
        failure: {
          reason: 'cadenceInternal:Generic',
          details: '',
          options: {
            //@ts-expect-error pass a category that is not in the IDL
            failureCategory: 'FAILURE_CATEGORY_UNKNOWN',
            nextRetryInterval: null,
          },
        },
      },
    };

    expect(formatWorkflowHistoryEvent(event)).toBe(null);
    expect(logger.warn).toHaveBeenCalledWith(
      { error: expect.any(ZodError) },
      'Failed to format workflow event'
    );
  });

  it.each(semaphoreEvents.map((event) => [event.attributes, event] as const))(
    'should skip %s without logging an error',
    (_attributes, event) => {
      expect(formatWorkflowHistoryEvent(event)).toBe(null);
      expect(logger.warn).not.toHaveBeenCalled();
    }
  );
});
