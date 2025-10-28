import { render, screen, userEvent } from '@/test-utils/rtl';

import { type ClusterAttributeScope } from '@/__generated__/proto-ts/uber/cadence/api/v1/ClusterAttributeScope';
import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';
import { type ActiveActiveDomain } from '@/views/shared/active-active/active-active.types';

import DomainPageMetadataFailoverVersionActiveActive from '../domain-page-metadata-failover-version-active-active';

describe(DomainPageMetadataFailoverVersionActiveActive.name, () => {
  it('renders the table with headers', () => {
    setup();

    expect(screen.getByText('Scope')).toBeInTheDocument();
    expect(screen.getByText('Attribute')).toBeInTheDocument();
    expect(screen.getByText('Active Cluster')).toBeInTheDocument();
    expect(screen.getByText('Failover Version')).toBeInTheDocument();
  });

  it('renders default entry with domain data', () => {
    setup();

    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('cluster0')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders multiple failover version entries', () => {
    setup({ attributeCount: 2 });

    // Default entry
    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('cluster0')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Additional entries
    expect(screen.getByText('scope1')).toBeInTheDocument();
    expect(screen.getByText('attribute1')).toBeInTheDocument();
    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();

    expect(screen.getByText('scope2')).toBeInTheDocument();
    expect(screen.getByText('attribute2')).toBeInTheDocument();
    expect(screen.getByText('cluster_2')).toBeInTheDocument();
    expect(screen.getByText('1001')).toBeInTheDocument();
  });

  it('does not show "Show all" button when entries are less than or equal to MAX_ATTRIBUTES_COUNT_TRUNCATED', () => {
    // 3 additional attributes + 1 default = 4 total (exactly at the limit)
    setup({ attributeCount: 3 });

    expect(screen.queryByText(/Show all/)).not.toBeInTheDocument();
  });

  it('shows "Show all" button when entries exceed MAX_ATTRIBUTES_COUNT_TRUNCATED', () => {
    // 5 additional attributes + 1 default = 6 total (exceeds limit of 4)
    setup({ attributeCount: 5 });

    expect(screen.getByText('Show all (6)')).toBeInTheDocument();
  });

  it('truncates entries when not expanded', () => {
    setup({ attributeCount: 5 });

    // Should show first 4 entries only (default + first 3 attributes)
    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('scope1')).toBeInTheDocument();
    expect(screen.getByText('scope2')).toBeInTheDocument();
    expect(screen.getByText('scope3')).toBeInTheDocument();

    // Should not show 5th and 6th entries
    expect(screen.queryByText('scope4')).not.toBeInTheDocument();
    expect(screen.queryByText('scope5')).not.toBeInTheDocument();
  });

  it('expands to show all entries when "Show all" button is clicked', async () => {
    const { user } = setup({ attributeCount: 5 });

    const showAllButton = screen.getByText('Show all (6)');
    await user.click(showAllButton);

    // Now all entries should be visible
    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('scope1')).toBeInTheDocument();
    expect(screen.getByText('scope2')).toBeInTheDocument();
    expect(screen.getByText('scope3')).toBeInTheDocument();
    expect(screen.getByText('scope4')).toBeInTheDocument();
    expect(screen.getByText('scope5')).toBeInTheDocument();

    // Button text should change
    expect(screen.getByText('Show less')).toBeInTheDocument();
    expect(screen.queryByText('Show all (6)')).not.toBeInTheDocument();
  });

  it('collapses to show truncated entries when "Show less" button is clicked', async () => {
    const { user } = setup({ attributeCount: 5 });

    // Expand first
    const showAllButton = screen.getByText('Show all (6)');
    await user.click(showAllButton);

    // Then collapse
    const showLessButton = screen.getByText('Show less');
    await user.click(showLessButton);

    // Should show first 4 entries only
    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('scope1')).toBeInTheDocument();
    expect(screen.getByText('scope2')).toBeInTheDocument();
    expect(screen.getByText('scope3')).toBeInTheDocument();

    // Should not show 5th and 6th entries
    expect(screen.queryByText('scope4')).not.toBeInTheDocument();
    expect(screen.queryByText('scope5')).not.toBeInTheDocument();

    // Button text should change back
    expect(screen.getByText('Show all (6)')).toBeInTheDocument();
    expect(screen.queryByText('Show less')).not.toBeInTheDocument();
  });
});

function setup({
  attributeCount = 0,
}: {
  attributeCount?: number;
} = {}) {
  const user = userEvent.setup();

  const activeClustersByClusterAttribute: Record<
    string,
    ClusterAttributeScope
  > = {};

  // Create additional attributes beyond the default one
  for (let i = 0; i < attributeCount; i++) {
    const scope = `scope${i + 1}`;
    activeClustersByClusterAttribute[scope] = {
      clusterAttributes: {
        [`attribute${i + 1}`]: {
          activeClusterName: `cluster_${i + 1}`,
          failoverVersion: `${1000 + i}`,
        },
      },
    };
  }

  const domain: ActiveActiveDomain = {
    ...mockActiveActiveDomain,
    activeClusters: {
      regionToCluster: {},
      activeClustersByClusterAttribute,
    },
  };

  render(<DomainPageMetadataFailoverVersionActiveActive {...domain} />);

  return { user };
}
