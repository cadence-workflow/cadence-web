import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionsClusterAttribute from '../workflow-actions-cluster-attribute';
import type { Props } from '../workflow-actions-cluster-attribute.types';

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

describe(WorkflowActionsClusterAttribute.name, () => {
  it('renders scope and name selects', () => {
    setup();

    expect(
      screen.getByRole('combobox', { name: 'Cluster Attribute Scope' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Cluster Attribute Name' })
    ).toBeInTheDocument();
  });

  it('renders name select as disabled when scope is not selected', () => {
    setup();

    const nameSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Name',
    });
    expect(nameSelect).toBeDisabled();
  });

  it('shows scope options from cluster attributes data', async () => {
    const { user } = setup();

    const scopeSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Scope',
    });
    await user.click(scopeSelect);

    expect(screen.getByText('region')).toBeInTheDocument();
    expect(screen.getByText('zone')).toBeInTheDocument();
  });

  it('calls onChange with scope and empty name when scope is selected', async () => {
    const { user, mockOnChange } = setup();

    const scopeSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Scope',
    });
    await user.click(scopeSelect);
    await user.click(screen.getByText('region'));

    expect(mockOnChange).toHaveBeenCalledWith({ scope: 'region', name: '' });
  });

  it('enables name select when a scope is selected', () => {
    setup({ value: { scope: 'region', name: '' } });

    const nameSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Name',
    });
    expect(nameSelect).not.toBeDisabled();
  });

  it('shows name options for the selected scope', async () => {
    const { user } = setup({ value: { scope: 'region', name: '' } });

    const nameSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Name',
    });
    await user.click(nameSelect);

    expect(screen.getByText('region0')).toBeInTheDocument();
    expect(screen.getByText('region1')).toBeInTheDocument();
  });

  it('calls onChange with scope and name when name is selected', async () => {
    const { user, mockOnChange } = setup({
      value: { scope: 'region', name: '' },
    });

    const nameSelect = screen.getByRole('combobox', {
      name: 'Cluster Attribute Name',
    });
    await user.click(nameSelect);
    await user.click(screen.getByText('region0'));

    expect(mockOnChange).toHaveBeenCalledWith({
      scope: 'region',
      name: 'region0',
    });
  });
});

function setup(props: Partial<Props> = {}) {
  const mockOnChange = jest.fn();
  const user = userEvent.setup();

  const defaultProps: Props = {
    clusterAttributesByScope: mockClusterAttributesByScope,
    onChange: mockOnChange,
    ...props,
  };

  render(<WorkflowActionsClusterAttribute {...defaultProps} />);

  return {
    user,
    mockOnChange,
  };
}
