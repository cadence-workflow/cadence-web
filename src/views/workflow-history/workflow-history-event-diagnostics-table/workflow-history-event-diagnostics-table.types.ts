import { type ComponentType } from 'react';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

export type Props = {
  metadata: any;
} & WorkflowPageParams;

export type MetadataValueComponentProps = {
  value: any;
} & WorkflowPageParams;

export type WorkflowHistoryEventDiagnosticsParser = {
  name: string;
  matcher: (key: string, value: unknown) => boolean;
  forceWrap?: boolean;
} & (
  | { hide?: false; renderValue: ComponentType<MetadataValueComponentProps> }
  | { hide: true; renderValue?: never }
);

export type ParsedWorkflowHistoryEventDiagnosticsField = {
  key: string;
  label: string;
  forceWrap?: boolean;
  value: React.ReactNode;
};
