import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';

import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import { type WorkflowPageTabName } from '../workflow-page-tabs/workflow-page-tabs.types';

import { type Props } from './workflow-page-tabs-error.types';

export default function WorkflowPageTabsError({ error, reset }: Props) {
  const { workflowTab } = useParams();
  const getConfig =
    workflowPageTabsConfig[workflowTab as WorkflowPageTabName]?.getErrorConfig;

  if (typeof getConfig !== 'function') {
    return (
      <PanelSection>
        <ErrorPanel
          error={error}
          message={'Failed to load workflow content'}
          reset={reset}
        />
      </PanelSection>
    );
  }

  const errorConfig = getConfig(error);
  return (
    <PanelSection>
      <ErrorPanel
        error={error}
        message={errorConfig.message}
        actions={errorConfig.actions}
        omitLogging={errorConfig.omitLogging}
        reset={reset}
      />
    </PanelSection>
  );
}
