import { type FieldPath, type UseFormSetError } from 'react-hook-form';
import { type ZodIssue } from 'zod';

import { type CreateScheduleFormData } from '../create-schedule-form/create-schedule-form.types';

function startWorkflowSubpath(
  path: ReadonlyArray<string | number>
): ReadonlyArray<string | number> | null {
  if (path[0] === 'startWorkflow') {
    return path.slice(1);
  }
  if (path[0] === 'action' && path[1] === 'startWorkflow') {
    return path.slice(2);
  }
  return null;
}

function toFormPath(
  path: ReadonlyArray<string | number>
): FieldPath<CreateScheduleFormData> | null {
  if (path[0] === 'cronExpression') {
    return 'cronExpression';
  }

  if (path[0] === 'pauseOnFailure') {
    return 'pauseOnFailure';
  }

  if (path[0] === 'spec' && path[1] === 'cronExpression') {
    return 'cronExpression';
  }

  if (path[0] === 'policies' && path[1] === 'pauseOnFailure') {
    return 'pauseOnFailure';
  }

  const rest = startWorkflowSubpath(path);
  if (!rest?.length) {
    return null;
  }

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
