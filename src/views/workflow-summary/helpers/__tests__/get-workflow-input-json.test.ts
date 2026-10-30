import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';

import getWorkflowInputJson from '../get-workflow-input-json';

type StartEvent = FormattedHistoryEventForType<'WorkflowExecutionStarted'>;

describe(getWorkflowInputJson.name, () => {
  it('returns the input of the start event', () => {
    const input = ['value', { key: 1 }];

    expect(getWorkflowInputJson({ input } as unknown as StartEvent)).toEqual(
      input
    );
  });

  it('returns an empty array when the start event has no input', () => {
    expect(getWorkflowInputJson({} as StartEvent)).toEqual([]);
  });

  it('returns an empty array when there is no start event', () => {
    expect(getWorkflowInputJson(undefined)).toEqual([]);
  });
});
