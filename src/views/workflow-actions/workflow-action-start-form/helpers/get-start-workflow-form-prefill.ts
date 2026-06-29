import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { type WorkflowStartedEvent } from '../hooks/use-workflow-started-event.types';
import { type StartWorkflowFormData } from '../workflow-action-start-form.types';

// Builds prefill values from the formatted WorkflowExecutionStarted event, whose
// payload fields (input, memo, searchAttributes, header) are already decoded by
// formatWorkflowHistory. Values are re-serialized with losslessJsonStringify
// because decoded numbers may be BigInt, which JSON.stringify cannot handle.
//
// validSearchAttributeKeys (the cluster's custom search attributes) filters the
// prefilled search attributes: the form's editor can only render keys it knows
// the value type for, so unknown keys are dropped. When undefined (registry not
// loaded yet) all keys are kept best-effort.
export default function getStartWorkflowFormPrefill(
  startedEvent: WorkflowStartedEvent | undefined,
  validSearchAttributeKeys?: ReadonlySet<string>
): Partial<StartWorkflowFormData> | undefined {
  if (!startedEvent) return undefined;

  const prefill: Partial<StartWorkflowFormData> = {};

  const workflowTypeName = startedEvent.workflowType?.name;
  if (workflowTypeName) {
    prefill.workflowType = { name: workflowTypeName };
  }

  const taskListName = startedEvent.taskList?.name;
  if (taskListName) {
    prefill.taskList = { name: taskListName };
  }

  const timeoutSeconds = startedEvent.executionStartToCloseTimeoutSeconds;
  if (typeof timeoutSeconds === 'number' && timeoutSeconds > 0) {
    prefill.executionStartToCloseTimeoutSeconds = timeoutSeconds;
  }

  const cronParts = startedEvent.cronSchedule?.trim().split(/\s+/);
  if (cronParts && cronParts.length === CRON_FIELD_ORDER.length) {
    prefill.scheduleType = 'CRON';
    prefill.cronSchedule = Object.fromEntries(
      CRON_FIELD_ORDER.map((key, index) => [key, cronParts[index]])
    ) as StartWorkflowFormData['cronSchedule'];
  }

  if (Array.isArray(startedEvent.input) && startedEvent.input.length > 0) {
    prefill.input = startedEvent.input.map((value) =>
      losslessJsonStringify(value)
    );
  }

  const memoFields = startedEvent.memo?.fields;
  if (memoFields && Object.keys(memoFields).length > 0) {
    prefill.memo = losslessJsonStringify(memoFields);
  }

  const headerFields = startedEvent.header?.fields;
  if (headerFields && Object.keys(headerFields).length > 0) {
    prefill.header = losslessJsonStringify(headerFields);
  }

  const indexedFields = startedEvent.searchAttributes?.indexedFields;
  if (indexedFields) {
    const rows = Object.entries(indexedFields)
      .filter(
        ([key]) =>
          !validSearchAttributeKeys || validSearchAttributeKeys.has(key)
      )
      .map(([key, value]) => ({ key, value: toSearchAttributeValue(value) }));
    if (rows.length > 0) {
      prefill.searchAttributes = rows;
    }
  }

  return Object.keys(prefill).length > 0 ? prefill : undefined;
}

function toSearchAttributeValue(value: unknown): string | number | boolean {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  // bigints and objects/arrays don't fit the scalar field, so serialize them
  return losslessJsonStringify(value);
}
