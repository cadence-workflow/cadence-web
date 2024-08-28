import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import logger from '@/utils/logger';

import { type Props } from './error-boundary.types';

export default function ErrorBoundary({
  children,
  omitLogging,
  ...restProps
}: Props) {
  return (
    <ReactErrorBoundary
      {...restProps}
      onError={(error) => {
        const shouldOmitLogging =
          typeof omitLogging === 'function'
            ? omitLogging(error)
            : Boolean(omitLogging);

        if (!shouldOmitLogging) {
          logger.error(error, error.message);
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
