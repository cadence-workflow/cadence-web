import parseWorkflowDiagnosticsMetadata from './helpers/parse-workflow-diagnostics-metadata';
import { styled } from './workflow-diagnostics-metadata-table.styles';
import { type Props } from './workflow-diagnostics-metadata-table.types';

export default function WorkflowDiagnosticsMetadataTable(props: Props) {
  const parsedMetadataItems = parseWorkflowDiagnosticsMetadata(props);

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
