import { type ComponentType } from 'react';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

export type Props = {
  metadata: any;
} & WorkflowPageParams;

export type MetadataValueComponentProps = {
  value: any;
} & WorkflowPageParams;

export type WorkflowDiagnosticsMetadataParser = {
  name: string;
  matcher: (key: string, value: unknown) => boolean;
  renderValue: ComponentType<MetadataValueComponentProps>;
  forceWrap?: boolean;
};

export type ParsedWorkflowDiagnosticsMetadataField = {
  key: string;
  label: string;
  forceWrap?: boolean;
  value: React.ReactNode;
};
