import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import logger from '@/utils/logger';

import { type Props } from './error-boundary.types';

export default function ErrorBoundary({ children, ...restProps }: Props) {
  return (
    <ReactErrorBoundary
      {...restProps}
      onError={(error) => logger.error(error, error.message)}
    >
      {children}
    </ReactErrorBoundary>
  );
}
