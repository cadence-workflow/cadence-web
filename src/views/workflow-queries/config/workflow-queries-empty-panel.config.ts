import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

const workflowQueriesEmptyPanelConfig = {
  message: 'No queries available for this workflow',
  omitLogging: true,
  actions: [
    {
      kind: 'link-external',
      label: 'Read more about workflow queries',
      link: 'https://cadenceworkflow.io/docs/concepts/queries',
    },
  ],
} as const satisfies ErrorPanelProps;

export default workflowQueriesEmptyPanelConfig;
