import React from 'react';

import { act, render, screen } from '@/test-utils/rtl';

import ErrorBoundary from '../error-boundary';

const BadComponent = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('test error');
  }

  return <div>Test component</div>;
};

const mockError = jest.fn();
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: {
    error: () => mockError(),
  },
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe(ErrorBoundary.name, () => {
  it('should render children without any problems', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <BadComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test component')).toBeInTheDocument();
  });

  it('should catch errors thrown in children', () => {
    try {
      act(() => {
        render(
          <ErrorBoundary fallback={<div>Fallback</div>}>
            <BadComponent shouldThrow={true} />
          </ErrorBoundary>
        );
      });
    } catch {
      expect(screen.getByText('Fallback')).toBeInTheDocument();
      expect(mockError).toHaveBeenCalledWith(expect.any(Error), 'Test error');
    }
  });

  it('should not log errors thrown in children if omitLogging is passed', () => {
    try {
      act(() => {
        render(
          <ErrorBoundary fallback={<div>Fallback</div>} omitLogging>
            <BadComponent shouldThrow={true} />
          </ErrorBoundary>
        );
      });
    } catch {
      expect(screen.getByText('Fallback')).toBeInTheDocument();
      expect(mockError).not.toHaveBeenCalled();
    }
  });
});
