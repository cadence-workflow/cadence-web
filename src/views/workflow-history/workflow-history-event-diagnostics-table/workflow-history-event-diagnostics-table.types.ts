import { type ComponentType } from 'react';

export type Props = {
  metadata: any;
};

export type MetadataValueComponentProps = {
  value: any;
};

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
