import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import {
  type DiagnosticsIssue,
  type DiagnosticsRootCause,
} from '../workflow-diagnostics.types';

export type Props = {
  issue: DiagnosticsIssue;
  isExpanded: boolean;
  onChangePanel: () => void;
  rootCauses: Array<DiagnosticsRootCause>;
} & WorkflowPageParams;
