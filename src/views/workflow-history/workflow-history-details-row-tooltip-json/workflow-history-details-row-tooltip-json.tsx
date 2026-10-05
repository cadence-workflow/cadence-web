import WorkflowHistoryEventDetailsJson from '@/views/workflow-history/workflow-history-event-details-json/workflow-history-event-details-json';

import { type DetailsRowValueComponentProps } from '../workflow-history-details-row/workflow-history-details-row.types';

import { styled } from './workflow-history-details-row-tooltip-json.styles';

export default function WorkflowHistoryDetailsRowTooltipJson({
  value,
  label,
  isNegative,
}: DetailsRowValueComponentProps) {
  return (
    <styled.JsonPreviewContainer>
      <styled.JsonPreviewLabel>{label}</styled.JsonPreviewLabel>
      <WorkflowHistoryEventDetailsJson
        entryValue={value}
        isNegative={isNegative}
      />
    </styled.JsonPreviewContainer>
  );
}
