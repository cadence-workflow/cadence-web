import { type ComponentType, type ReactNode } from 'react';

type BaseAction = {
  kind: string;
  label: string;
  shape?: 'pill' | 'default' | 'round' | 'square' | 'circle';
  buttonKind?: 'primary' | 'secondary' | 'tertiary';
  startEnhancer?: ReactNode | ComponentType<any>;
  endEnhancer?: ReactNode | ComponentType<any>;
};

type RetryAction = BaseAction & {
  kind: 'retry';
};

type InternalLinkAction = BaseAction & {
  kind: 'link-internal';
  link: string;
};

type ExternalLinkAction = BaseAction & {
  kind: 'link-external';
  link: string;
};

type CallbackAction = BaseAction & {
  kind: 'callback';
  onClick: () => void;
};

export type ErrorAction =
  | RetryAction
  | InternalLinkAction
  | ExternalLinkAction
  | CallbackAction;

export type Props = {
  /** Optional underlying `Error` used for logging and the expandable details banner. */
  error?: Error;
  /** Primary message rendered as the panel heading. */
  message: string;
  /**
   * Optional secondary text rendered under `message`.
   * Useful for empty-state explanations
   */
  description?: React.ReactNode;
  /** Optional list of action buttons rendered below the message. */
  actions?: Array<ErrorAction>;
  /** Callback invoked after a `retry` action, e.g. to reset an error boundary. */
  reset?: () => void;
  /** When true, suppresses the automatic `logger.error` call for `error`. */
  omitLogging?: boolean;
  /** When true, shows an expandable banner exposing `error.message` with a copy button. */
  showErrorDetails?: boolean;
};
