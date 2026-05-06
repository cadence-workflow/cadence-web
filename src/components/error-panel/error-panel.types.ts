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
  error?: Error;
  message: string;
  /**
   * Optional secondary copy rendered under `message`.
   * Useful for empty-state explanations such as
   * "click the button below to create a schedule…".
   */
  description?: React.ReactNode;
  actions?: Array<ErrorAction>;
  reset?: () => void;
  omitLogging?: boolean;
  showErrorDetails?: boolean;
};
