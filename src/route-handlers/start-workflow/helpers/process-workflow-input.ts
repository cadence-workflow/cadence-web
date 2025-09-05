import { type ProcessWorkflowInputParams } from './process-workflow-input.types';

export function processWorkflowInput({
  input,
  workerSDKLanguage,
}: ProcessWorkflowInputParams): string | undefined {
  if (!input || input.length === 0) {
    return undefined;
  }

  if (workerSDKLanguage === 'JAVA') {
    return input.length > 1 || Array.isArray(input[0])
      ? JSON.stringify(input)
      : JSON.stringify(input[0]);
  } else {
    return input.map((i) => JSON.stringify(i)).join(' ');
  }
}
