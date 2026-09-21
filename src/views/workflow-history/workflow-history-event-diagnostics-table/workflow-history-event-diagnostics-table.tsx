import { useMemo } from 'react';

import workflowHistoryDiagnosticsParsersConfig from '../config/workflow-history-diagnostics-parsers.config';

import { styled } from './workflow-history-event-diagnostics-table.styles';
import {
  type ParsedWorkflowHistoryEventDiagnosticsField,
  type Props,
} from './workflow-history-event-diagnostics-table.types';

export default function WorkflowHistoryEventDiagnosticsTable({
  metadata,
  onClickHistoryEvent,
}: Props) {
  const parsedMetadataItems = useMemo(
    () =>
      Object.entries(metadata)
        .map(([key, value]) => {
          const renderConfig = workflowHistoryDiagnosticsParsersConfig.find(
            (c) => c.matcher(key, value)
          );

          if (renderConfig?.hide) {
            return null;
          }

          return {
            key,
            label: key,
            value: renderConfig ? (
              <renderConfig.renderValue
                value={value}
                onClickHistoryEvent={onClickHistoryEvent}
              />
            ) : (
              String(value)
            ),
            forceWrap: renderConfig?.forceWrap,
          };
        })
        .filter(
          (field) => field !== null
        ) as Array<ParsedWorkflowHistoryEventDiagnosticsField>,
    [metadata, onClickHistoryEvent]
  );

  return (
    <styled.MetadataTableContainer>
      {parsedMetadataItems.map((metadataItem) => (
        <styled.MetadataItemRow
          $forceWrap={metadataItem.forceWrap}
          key={metadataItem.key}
        >
          <styled.MetadataItemLabel $forceWrap={metadataItem.forceWrap}>
            {metadataItem.label}
          </styled.MetadataItemLabel>
          <styled.MetadataItemValue>
            {metadataItem.value}
          </styled.MetadataItemValue>
        </styled.MetadataItemRow>
      ))}
    </styled.MetadataTableContainer>
  );
}
