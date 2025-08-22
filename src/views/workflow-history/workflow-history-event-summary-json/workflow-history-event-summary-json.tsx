import { StatefulTooltip } from 'baseui/tooltip';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import WorkflowHistoryEventDetailsJson from '../workflow-history-event-details-json/workflow-history-event-details-json';
import { type EventSummaryValueComponentProps } from '../workflow-history-event-summary/workflow-history-event-summary.types';

import {
  overrides,
  styled,
} from './workflow-history-event-summary-json.styles';

export default function WorkflowHistoryEventSummaryJson({
  value,
  label,
  isNegative,
}: EventSummaryValueComponentProps) {
  return (
    <StatefulTooltip
      content={
        <styled.JsonPreviewContainer>
          <styled.JsonPreviewLabel>{label}</styled.JsonPreviewLabel>
          <WorkflowHistoryEventDetailsJson
            entryValue={value}
            isNegative={isNegative}
          />
        </styled.JsonPreviewContainer>
      }
      ignoreBoundary
      placement="bottom"
      showArrow
      overrides={overrides.popover}
    >
      <styled.JsonViewContainer $isNegative={isNegative ?? false}>
        {losslessJsonStringify(value)}
      </styled.JsonViewContainer>
    </StatefulTooltip>
  );
}
