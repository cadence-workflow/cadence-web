import { render, screen, userEvent } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';
import { type ActiveActiveDomain } from '@/views/shared/active-active/active-active.types';

import { DEFAULT_CLUSTER_SCOPE } from '../../domain-page-failovers/domain-page-failovers.constants';
import DomainPageFailoversFilters from '../domain-page-failovers-filters';

describe(DomainPageFailoversFilters.name, () => {
  it('renders both filter comboboxes and reset button', () => {
    setup({});

    expect(screen.getByText('Cluster Attribute Scope')).toBeInTheDocument();
    expect(screen.getByText('Cluster Attribute Value')).toBeInTheDocument();
    expect(screen.getByText('Reset filters')).toBeInTheDocument();
  });

  it('displays cluster attribute scope options including primary and domain scopes', async () => {
    const { user } = setup({});

    const scopeCombobox = screen.getByPlaceholderText(
      'Scope of cluster attribute'
    );
    await user.click(scopeCombobox);

    expect(screen.getByText(DEFAULT_CLUSTER_SCOPE)).toBeInTheDocument();
    expect(screen.getByText('region')).toBeInTheDocument();
  });

  it('disables cluster attribute value combobox when scope is default', () => {
    setup({
      queryParamsOverrides: {
        clusterAttributeScope: DEFAULT_CLUSTER_SCOPE,
      },
    });

    expect(
      screen.getByPlaceholderText('Value/name of cluster attribute')
    ).toBeDisabled();
  });

  it('enables cluster attribute value combobox when scope is not primary', () => {
    setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
      },
    });

    expect(
      screen.getByPlaceholderText('Value/name of cluster attribute')
    ).not.toBeDisabled();
  });

  it('displays cluster attribute values for selected scope', async () => {
    const { user } = setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
      },
    });

    const valueCombobox = screen.getByPlaceholderText(
      'Value/name of cluster attribute'
    );
    await user.click(valueCombobox);

    expect(screen.getByText('region0')).toBeInTheDocument();
    expect(screen.getByText('region1')).toBeInTheDocument();
  });

  it('calls setQueryParams with new scope and resets value when scope changes', async () => {
    const { user, mockSetQueryParams } = setup({});

    const scopeCombobox = screen.getByPlaceholderText(
      'Scope of cluster attribute'
    );
    await user.click(scopeCombobox);
    await user.click(screen.getByText('region'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      clusterAttributeScope: 'region',
      clusterAttributeValue: undefined,
    });
  });

  it('calls setQueryParams with new value when cluster attribute value changes', async () => {
    const { user, mockSetQueryParams } = setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
      },
    });

    const valueCombobox = screen.getByPlaceholderText(
      'Value/name of cluster attribute'
    );
    await user.click(valueCombobox);
    await user.click(screen.getByText('region0'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      clusterAttributeValue: 'region0',
    });
  });

  it('calls setQueryParams with undefined when clearing scope', async () => {
    const { user, mockSetQueryParams } = setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
        clusterAttributeValue: 'region0',
      },
    });

    const scopeCombobox = screen.getByPlaceholderText(
      'Scope of cluster attribute'
    );
    await user.click(scopeCombobox);

    // Find and click the clear button (BaseUI Combobox clearable)
    const clearButtons = screen.getAllByLabelText('Clear value');
    await user.click(clearButtons[0]);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      clusterAttributeScope: undefined,
      clusterAttributeValue: undefined,
    });
  });

  it('calls setQueryParams with undefined when clearing value', async () => {
    const { user, mockSetQueryParams } = setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
        clusterAttributeValue: 'region0',
      },
    });

    const valueCombobox = screen.getByPlaceholderText(
      'Value/name of cluster attribute'
    );
    await user.click(valueCombobox);

    // Find and click the clear button
    const clearButtons = screen.getAllByLabelText('Clear value');
    await user.click(clearButtons[1]);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      clusterAttributeValue: undefined,
    });
  });

  it('resets both filters when reset filters button is clicked', async () => {
    const { user, mockSetQueryParams } = setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
        clusterAttributeValue: 'region0',
      },
    });

    const resetButton = screen.getByText('Reset filters');
    await user.click(resetButton);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      clusterAttributeScope: undefined,
      clusterAttributeValue: undefined,
    });
  });

  it('displays current scope value in combobox', () => {
    setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
      },
    });

    expect(
      screen.getByPlaceholderText('Scope of cluster attribute')
    ).toHaveValue('region');
  });

  it('displays current value in cluster attribute value combobox', () => {
    setup({
      queryParamsOverrides: {
        clusterAttributeScope: 'region',
        clusterAttributeValue: 'region0',
      },
    });

    expect(
      screen.getByPlaceholderText('Value/name of cluster attribute')
    ).toHaveValue('region0');
  });
});

function setup({
  queryParamsOverrides,
  domainDescriptionOverrides,
}: {
  queryParamsOverrides?: Partial<
    PageQueryParamValues<typeof domainPageQueryParamsConfig>
  >;
  domainDescriptionOverrides?: Partial<ActiveActiveDomain>;
} = {}) {
  const mockSetQueryParams = jest.fn();

  const domainDescription = {
    ...mockActiveActiveDomain,
    ...domainDescriptionOverrides,
  };

  const queryParams = {
    ...mockDomainPageQueryParamsValues,
    ...queryParamsOverrides,
  };

  render(
    <DomainPageFailoversFilters
      domainDescription={domainDescription}
      queryParams={queryParams}
      setQueryParams={mockSetQueryParams}
    />
  );

  const user = userEvent.setup();

  return { mockSetQueryParams, user };
}
