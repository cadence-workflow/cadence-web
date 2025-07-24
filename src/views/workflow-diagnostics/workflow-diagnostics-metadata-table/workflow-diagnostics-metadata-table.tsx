import { useMemo } from 'react';

import workflowDiagnosticsMetadataParsersConfig from '../config/workflow-diagnostics-metadata-parsers.config';

import { styled } from './workflow-diagnostics-metadata-table.styles';
import { type Props } from './workflow-diagnostics-metadata-table.types';

export default function WorkflowDiagnosticsMetadataTable({
  metadata,
  ...workflowPageParams
}: Props) {
  const parsedMetadataItems = useMemo(
    () =>
      Object.entries(metadata).map(([key, value]) => {
        const renderConfig = workflowDiagnosticsMetadataParsersConfig.find(
          (c) => c.matcher(key, value)
        );

        return {
          key,
          label: key,
          value: renderConfig ? (
            <renderConfig.renderValue value={value} {...workflowPageParams} />
          ) : (
            String(value)
          ),
          forceWrap: renderConfig?.forceWrap,
        };
      }),
    [metadata, workflowPageParams]
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
