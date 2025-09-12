import { type ProcessWorkflowInputParams } from './process-workflow-input.types';

export default function processWorkflowInput({
  input,
  workerSDKLanguage,
}: ProcessWorkflowInputParams): string | undefined {
  if (!input || input.length === 0) {
    return undefined;
  }

  switch (workerSDKLanguage) {
    case 'JAVA':
      /**
       * Java accepts multiple arguments to be passed as items in an array. Single argument is passed as is.
       * In case of multiple arguments we parse the entire input as a JSON array with the already existing [] around it.
       * In case of single argument we parse it without the surrounding [],
       * except if it is an array, in which case we parse it as a JSON array with the surrounding [] to prevent treating it as multiple arguments and a single item in the array.
       */
      return input.length > 1 || Array.isArray(input[0])
        ? JSON.stringify(input)
        : JSON.stringify(input[0]);
    default:
      /**
       * Go accepts multiple arguments to be passed separated by spaces.
       * Each item is stringified separately and then joined with spaces.
       */
      return input.map((i) => JSON.stringify(i)).join(' ');
  }
}
