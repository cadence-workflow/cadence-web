import React, { useState } from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionsClusterAttribute from '../workflow-actions-cluster-attribute';
import {
  type ClusterAttributeValue,
  type Props,
} from '../workflow-actions-cluster-attribute.types';

const mockClusterAttributesByScope: Props['clusterAttributesByScope'] = {
  region: {
    clusterAttributes: {
      region0: { activeClusterName: 'cluster0', failoverVersion: '0' },
      region1: { activeClusterName: 'cluster1', failoverVersion: '2' },
    },
  },
  zone: {
    clusterAttributes: {
      'zone-a': { activeClusterName: 'cluster0', failoverVersion: '0' },
    },
  },
};

describe('WorkflowActionsClusterAttribute', () => {
  it('renders scope and name selects', async () => {
    await setup();

    expect(
      screen.getByRole('combobox', { name: 'Cluster Attribute Scope' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Cluster Attribute Name' })
    ).toBeInTheDocument();
  });

  it('renders name select as disabled when scope is not selected', async () => {
    await setup();

    const nameSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Name',
    });
    expect(nameSelect).toBeDisabled();
  });

  it('shows scope options from cluster attributes data', async () => {
    const { user } = await setup();

    const scopeSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Scope',
    });
    await user.click(scopeSelect);

    expect(screen.getByText('region')).toBeInTheDocument();
    expect(screen.getByText('zone')).toBeInTheDocument();
  });
});

function TestWrapper() {
  const [value, setValue] = useState<ClusterAttributeValue | undefined>(
    undefined
  );

  return (
    <WorkflowActionsClusterAttribute
      clusterAttributesByScope={mockClusterAttributesByScope}
      value={value}
      onChange={setValue}
    />
  );
}

async function setup() {
  const user = userEvent.setup();
  const renderResult = render(<TestWrapper />);
  return { user, ...renderResult };
}
