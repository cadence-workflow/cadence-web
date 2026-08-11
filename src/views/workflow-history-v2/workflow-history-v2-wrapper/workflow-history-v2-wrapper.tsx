import WorkflowHistoryContextProvider from '../workflow-history-context-provider/workflow-history-context-provider';
import WorkflowHistoryV2 from '../workflow-history-v2';
import { type Props } from '../workflow-history-v2.types';

export default function WorkflowHistoryV2Wrapper(props: Props) {
  return (
    <WorkflowHistoryContextProvider>
      <WorkflowHistoryV2 {...props} />
    </WorkflowHistoryContextProvider>
  );
}
