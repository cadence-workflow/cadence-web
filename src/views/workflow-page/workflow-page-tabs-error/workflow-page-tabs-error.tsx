import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';

import workflowPageTabsErrorConfig from '../config/workflow-page-tabs-error.config';
import { type WorkflowPageTabName } from '../workflow-page-tab-content/workflow-page-tab-content.types';

import { type Props } from './workflow-page-tabs-error.types';

export default function WorkflowPageTabsError({ error, reset }: Props) {
  const { workflowTab } = useParams();
  const getConfig =
    workflowPageTabsErrorConfig[workflowTab as WorkflowPageTabName];

  if (typeof getConfig !== 'function') {
    return (
      <div>
        <ErrorPanel
          error={error}
          message={'Failed to load workflow content'}
          reset={reset}
        />
      </div>
    );
  }

  const errorConfig = getConfig(error);
  return (
    <ErrorPanel
      error={error}
      message={errorConfig.message}
      actions={errorConfig.actions}
      omitLogging={errorConfig.omitLogging}
      reset={reset}
    />
  );
}
