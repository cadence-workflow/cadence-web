import WorkflowHistoryEventDetailsGroup from '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group';

import { styled } from './workflow-history-panel-details-entry.styles';
import { type Props } from './workflow-history-panel-details-entry.types';

export default function WorkflowHistoryPanelDetailsEntry({
  detail,
  ...workflowPageParams
}: Props) {
  const ValueComponent = detail.renderConfig?.valueComponent;

  if (ValueComponent !== undefined && !detail.isGroup) {
    return (
      <ValueComponent
        entryKey={detail.key}
        entryPath={detail.path}
        entryValue={detail.value}
        isNegative={detail.isNegative}
        {...workflowPageParams}
      />
    );
  }

  return (
    <styled.PanelContainer $isNegative={detail.isNegative}>
      <styled.PanelLabel $isNegative={detail.isNegative}>
        {detail.path}
      </styled.PanelLabel>
      <styled.PanelValue $isNegative={detail.isNegative}>
        {detail.isGroup ? (
          <WorkflowHistoryEventDetailsGroup
            entries={detail.groupEntries}
            parentGroupPath={detail.path}
            decodedPageUrlParams={workflowPageParams}
          />
        ) : (
          detail.value
        )}
      </styled.PanelValue>
    </styled.PanelContainer>
  );
}
