import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import DomainsPageErrorBanner from '../domains-page-error-banner';
import { type Props } from '../domains-page-error-banner.types';

jest.mock('../../config/domains-page-error-banner.config', () => ({
  icon: () => <div data-testid="mock-error-icon" />,
  getErrorMessage: ({ failedClusters }: Props) =>
    `Mock message for clusters failure: ${failedClusters
      .map(({ clusterName, httpStatus }) => `${clusterName} (${httpStatus})`)
      .join(', ')}`,
}));

describe(DomainsPageErrorBanner.name, () => {
  it('should render if there are failed clusters', async () => {
    render(
      <DomainsPageErrorBanner
        failedClusters={[
          { clusterName: 'cluster_1', httpStatus: 404 },
          { clusterName: 'cluster_2', httpStatus: 503 },
        ]}
      />
    );

    expect(await screen.findByTestId('mock-error-icon')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Mock message for clusters failure: cluster_1 (404), cluster_2 (503)'
      )
    ).toBeInTheDocument();
  });

  it('should not render anything if no clusters failed', async () => {
    render(<DomainsPageErrorBanner failedClusters={[]} />);

    expect(screen.queryByTestId('mock-error-icon')).toBeNull();
    expect(screen.queryByText(/Mock message for clusters failure/)).toBeNull();
  });
});
