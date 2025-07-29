import getWorkflowPageErrorConfig from '@/views/workflow-page/helpers/get-workflow-page-error-config';
import { type WorkflowPageTabErrorConfig } from '@/views/workflow-page/workflow-page-tabs-error/workflow-page-tabs-error.types';

import {
  DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG,
  DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG,
} from '../workflow-diagnostics.constants';

export default function getWorkflowDiagnosticsErrorConfig(
  error: Error
): WorkflowPageTabErrorConfig {
  if (error.message === DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG) {
    return {
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
  }

  if (error.message === DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG) {
    return {
      message: 'Cannot load diagnostics for a running workflow',
      omitLogging: true,
      actions: [
        {
          kind: 'retry',
          label: 'Retry',
        },
        {
          kind: 'link-internal',
          link: './summary',
          label: 'Go to workflow summary',
        },
      ],
    };
  }

  return getWorkflowPageErrorConfig(
    error,
    'Failed to load workflow diagnostics',
    'diagnostics'
  );
}
