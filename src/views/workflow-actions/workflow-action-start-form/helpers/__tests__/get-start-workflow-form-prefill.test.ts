import { type WorkflowStartedEvent } from '../../hooks/use-workflow-started-event.types';
import getStartWorkflowFormPrefill from '../get-start-workflow-form-prefill';

// Helper builds a formatted started event with only the fields under test.
const startedEvent = (overrides: Partial<WorkflowStartedEvent>) =>
  ({
    eventType: 'WorkflowExecutionStarted',
    ...overrides,
  }) as WorkflowStartedEvent;

describe('getStartWorkflowFormPrefill', () => {
  it('returns undefined when there is no started event', () => {
    expect(getStartWorkflowFormPrefill(undefined)).toBeUndefined();
  });

  it('returns undefined when nothing is prefillable', () => {
    expect(getStartWorkflowFormPrefill(startedEvent({}))).toBeUndefined();
  });

  it('maps workflow type, task list and timeout', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({
          workflowType: { name: 'MyWorkflowType' },
          taskList: { name: 'my-task-list', kind: null },
          executionStartToCloseTimeoutSeconds: 600,
        })
      )
    ).toEqual({
      workflowType: { name: 'MyWorkflowType' },
      taskList: { name: 'my-task-list' },
      executionStartToCloseTimeoutSeconds: 600,
    });
  });

  it('parses a cron schedule into form fields', () => {
    expect(
      getStartWorkflowFormPrefill(startedEvent({ cronSchedule: '0 12 * * 5' }))
    ).toEqual({
      scheduleType: 'CRON',
      cronSchedule: {
        minutes: '0',
        hours: '12',
        daysOfMonth: '*',
        months: '*',
        daysOfWeek: '5',
      },
    });
  });

  it('serializes decoded input arguments to JSON strings', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({ input: [{ foo: 'bar' }, 42, 'plain'] })
      )
    ).toEqual({ input: ['{"foo":"bar"}', '42', '"plain"'] });
  });

  it('serializes decoded memo and header field maps', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({
          memo: { fields: { team: 'cadence', count: 3 } },
          header: { fields: { tracing: 'on' } },
        })
      )
    ).toEqual({
      memo: '{"team":"cadence","count":3}',
      header: '{"tracing":"on"}',
    });
  });

  it('maps decoded search attributes into key/value rows', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({
          searchAttributes: {
            indexedFields: { CustomKeywordField: 'abc', CustomIntField: 7 },
          },
        })
      )
    ).toEqual({
      searchAttributes: [
        { key: 'CustomKeywordField', value: 'abc' },
        { key: 'CustomIntField', value: 7 },
      ],
    });
  });

  it('drops search attribute keys not in the custom registry', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({
          searchAttributes: {
            indexedFields: {
              CustomKeywordField: 'abc',
              CadenceChangeVersion: 'system-only',
            },
          },
        }),
        new Set(['CustomKeywordField'])
      )
    ).toEqual({
      searchAttributes: [{ key: 'CustomKeywordField', value: 'abc' }],
    });
  });

  it('omits search attributes when none match the custom registry', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({
          workflowType: { name: 'MyWorkflowType' },
          searchAttributes: { indexedFields: { CadenceChangeVersion: 'x' } },
        }),
        new Set(['CustomKeywordField'])
      )
    ).toEqual({ workflowType: { name: 'MyWorkflowType' } });
  });

  it('ignores empty payload maps and a malformed cron schedule', () => {
    expect(
      getStartWorkflowFormPrefill(
        startedEvent({
          workflowType: { name: 'MyWorkflowType' },
          cronSchedule: '0 12 *',
          memo: { fields: {} },
          searchAttributes: { indexedFields: {} },
          input: [],
        })
      )
    ).toEqual({ workflowType: { name: 'MyWorkflowType' } });
  });
});
