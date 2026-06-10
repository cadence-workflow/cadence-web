import { type FieldPath, type UseFormSetError } from 'react-hook-form';
import { type ZodIssue } from 'zod';

import { type CreateScheduleFormData } from '../create-schedule-form/create-schedule-form.types';

function toFormPath(
  path: ReadonlyArray<string | number>
): FieldPath<CreateScheduleFormData> | null {
  if (path[0] === 'spec' && path[1] === 'cronExpression') {
    return 'cronExpression';
  }

  if (path[0] !== 'action' || path[1] !== 'startWorkflow') {
    return null;
  }

  const rest = path.slice(2);
  if (rest[0] === 'workflowType' && rest[1] === 'name') {
    return 'workflowType.name';
  }
  if (rest[0] === 'taskList' && rest[1] === 'name') {
    return 'taskList.name';
  }
  if (rest[0] === 'workflowIdPrefix') {
    return 'workflowIdPrefix';
  }
  if (rest[0] === 'executionStartToCloseTimeoutSeconds') {
    return 'executionStartToCloseTimeoutSeconds';
  }
  if (rest[0] === 'taskStartToCloseTimeoutSeconds') {
    return 'taskStartToCloseTimeoutSeconds';
  }
  if (rest[0] === 'workerSDKLanguage') {
    return 'workerSDKLanguage';
  }
  if (rest[0] === 'input' && typeof rest[1] === 'number') {
    return `input.${rest[1]}` as FieldPath<CreateScheduleFormData>;
  }

  return null;
}

export default function mapServerValidationIssuesToCreateScheduleForm(
  issues: Array<ZodIssue>,
  setError: UseFormSetError<CreateScheduleFormData>
): { unmappedMessages: string[] } {
  const unmappedMessages: string[] = [];

  for (const issue of issues) {
    const formPath = toFormPath(issue.path);
    if (formPath) {
      setError(formPath, { type: 'server', message: issue.message });
    } else {
      unmappedMessages.push(issue.message);
    }
  }

  return { unmappedMessages };
}
