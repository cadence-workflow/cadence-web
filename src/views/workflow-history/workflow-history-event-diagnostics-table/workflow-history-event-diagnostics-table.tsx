import { useMemo } from 'react';

import workflowHistoryDiagnosticsParsersConfig from '../config/workflow-history-diagnostics-parsers.config';

import { styled } from './workflow-history-event-diagnostics-table.styles';
import {
  type ParsedWorkflowHistoryEventDiagnosticsField,
  type Props,
} from './workflow-history-event-diagnostics-table.types';

export default function WorkflowHistoryEventDiagnosticsTable({
  metadata,
  isCompact,
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
              <renderConfig.renderValue value={value} />
            ) : (
              String(value)
            ),
            forceWrap: renderConfig?.forceWrap,
          };
        })
        .filter(
          (field) => field !== null
        ) as Array<ParsedWorkflowHistoryEventDiagnosticsField>,
    [metadata]
  );

  return (
    <styled.MetadataTableContainer $isCompact={isCompact}>
      {parsedMetadataItems.map((metadataItem) => (
        <styled.MetadataItemRow
          $forceWrap={metadataItem.forceWrap}
          $isCompact={isCompact}
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
