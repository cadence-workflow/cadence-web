import WorkflowHistoryContextProvider from '../workflow-history-context-provider/workflow-history-context-provider';
import WorkflowHistory from '../workflow-history';
import { type Props } from '../workflow-history.types';

export default function WorkflowHistoryWrapper(props: Props) {
  return (
    <WorkflowHistoryContextProvider>
      <WorkflowHistory {...props} />
    </WorkflowHistoryContextProvider>
  );
}
