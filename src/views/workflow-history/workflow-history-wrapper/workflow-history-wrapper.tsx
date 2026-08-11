import WorkflowHistoryContextProvider from '@/views/workflow-history-v2/workflow-history-context-provider/workflow-history-context-provider';

import WorkflowHistoryComponent from '../workflow-history-component/workflow-history-component';
import { type Props } from '../workflow-history.types';

export default function WorkflowHistoryWrapper(props: Props) {
  return (
    <WorkflowHistoryContextProvider>
      <WorkflowHistoryComponent {...props} />
    </WorkflowHistoryContextProvider>
  );
}
