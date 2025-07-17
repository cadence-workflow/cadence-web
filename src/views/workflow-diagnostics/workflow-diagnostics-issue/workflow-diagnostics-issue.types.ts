import {
  type DiagnosticsIssue,
  type DiagnosticsRootCause,
} from '../workflow-diagnostics.types';

export type Props = {
  issue: DiagnosticsIssue;
  rootCauses: Array<DiagnosticsRootCause>;
};
