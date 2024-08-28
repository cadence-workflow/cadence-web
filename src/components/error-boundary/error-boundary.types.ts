import { type ErrorBoundaryProps } from 'react-error-boundary';

export type Props = ErrorBoundaryProps & {
  omitLogging?: boolean | ((err: Error) => boolean);
};
