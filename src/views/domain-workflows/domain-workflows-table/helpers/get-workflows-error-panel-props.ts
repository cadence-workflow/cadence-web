import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

export default function getWorkflowsErrorPanelProps({
  error,
  areSearchParamsAbsent,
}: {
  error: Error | null;
  areSearchParamsAbsent: boolean;
}): ErrorPanelProps | undefined {
  if (error) {
    return {
      message: 'Failed to fetch workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    };
  }

  if (areSearchParamsAbsent) {
    return {
      message: 'No workflows found for this domain',
      actions: [
        {
          kind: 'link-external',
          label: 'Get started on workflows',
          link: 'https://cadenceworkflow.io/docs/concepts/workflows',
        },
      ],
      omitLogging: true,
    };
  }

  return undefined;
}
