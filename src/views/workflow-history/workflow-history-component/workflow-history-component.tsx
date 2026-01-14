import { useContext } from 'react';

import WorkflowHistoryV2 from '@/views/workflow-history-v2/workflow-history-v2';

import WorkflowHistory from '../workflow-history';
import { WorkflowHistoryContext } from '../workflow-history-context-provider/workflow-history-context-provider';
import { type Props } from '../workflow-history.types';

export default function WorkflowHistoryComponent(props: Props) {
  const { isWorkflowHistoryV2Selected } = useContext(WorkflowHistoryContext);

  return isWorkflowHistoryV2Selected ? (
    <WorkflowHistoryV2 {...props} />
  ) : (
    <WorkflowHistory {...props} />
  );
}
