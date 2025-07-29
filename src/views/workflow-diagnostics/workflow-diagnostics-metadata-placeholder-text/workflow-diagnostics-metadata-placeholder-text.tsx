import { styled } from './workflow-diagnostics-metadata-placeholder-text.styles';
import { type Props } from './workflow-diagnostics-metadata-placeholder-text.types';

export default function WorkflowDiagnosticsMetadataPlaceholderText({
  placeholderText,
}: Props) {
  return <styled.PlaceholderText>{placeholderText}</styled.PlaceholderText>;
}
