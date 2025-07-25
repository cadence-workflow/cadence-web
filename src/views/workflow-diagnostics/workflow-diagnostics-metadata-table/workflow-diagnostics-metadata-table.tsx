import { type Props } from './workflow-diagnostics-metadata-table.types';

export default function WorkflowDiagnosticsMetadataTable(props: Props) {
  return <div>{JSON.stringify(props.metadata, null, 2)}</div>;
}
