import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import WorkflowHistoryV2 from '@/views/workflow-history-v2/workflow-history-v2';

import WorkflowHistory from '../workflow-history';
import WorkflowHistoryContextProvider from '../workflow-history-context-provider/workflow-history-context-provider';
import { type Props } from '../workflow-history.types';

export default function WorkflowHistoryWrapper(props: Props) {
  const { data: isHistoryPageV2Enabled } = useSuspenseConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  return (
    <WorkflowHistoryContextProvider>
      {isHistoryPageV2Enabled ? (
        <WorkflowHistoryV2 {...props} />
      ) : (
        <WorkflowHistory {...props} />
      )}
    </WorkflowHistoryContextProvider>
  );
}
