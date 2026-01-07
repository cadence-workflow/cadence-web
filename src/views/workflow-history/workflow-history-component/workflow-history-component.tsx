import { useContext } from 'react';

import WorkflowHistoryV2 from '@/views/workflow-history-v2/workflow-history-v2';

import WorkflowHistory from '../workflow-history';
import { WorkflowHistoryContext } from '../workflow-history-context-provider/workflow-history-context-provider';
import { type Props } from '../workflow-history.types';

export default function WorkflowHistoryComponent(props: Props) {
<<<<<<< HEAD
  const { isWorkflowHistoryV2Selected } = useContext(WorkflowHistoryContext);

  return isWorkflowHistoryV2Selected ? (
=======
  const { isWorkflowHistoryV2Enabled } = useContext(WorkflowHistoryContext);

  return isWorkflowHistoryV2Enabled ? (
>>>>>>> c32111a1 (Implement using local storage and restructure code)
    <WorkflowHistoryV2 {...props} />
  ) : (
    <WorkflowHistory {...props} />
  );
}
