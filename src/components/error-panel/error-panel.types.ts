type BaseAction = {
  kind: string;
  label: string;
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

export type ErrorAction = RetryAction | InternalLinkAction | ExternalLinkAction;

export type Props = {
  error?: Error;
  message: string;
  actions?: Array<ErrorAction>;
  reset?: () => void;
  omitLogging?: boolean;
};
