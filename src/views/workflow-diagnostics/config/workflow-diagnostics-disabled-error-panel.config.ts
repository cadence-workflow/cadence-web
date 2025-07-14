import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

const workflowDiagnosticsDisabledErrorPanelConfig: ErrorPanelProps = {
  message: 'Workflow Diagnostics is currently disabled',
  omitLogging: true,
  actions: [
    {
      kind: 'link-internal',
      link: './summary',
      label: 'Go to workflow summary',
    },
  ],
};

export default workflowDiagnosticsDisabledErrorPanelConfig;
