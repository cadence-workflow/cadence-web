import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as PageFiltersToggleProps } from '@/components/page-filters/page-filters-toggle/page-filters-toggle.types';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import { type WorkflowStatus } from '../../workflow-status-tag/workflow-status-tag.types';
import WorkflowsHeader from '../workflows-header';
import { type WorkflowsFiltersValues } from '../workflows-header.types';

const mockFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { status: WorkflowStatus | undefined }
  >,
] = [
  {
    id: 'filter1',
    getValue: (queryParams) => ({ status: queryParams.status }),
    formatValue: (v) => v,
    component: () => <div>filter</div>,
  },
];

jest.mock(
  '@/components/page-filters/page-filters-search/page-filters-search',
  () => jest.fn(() => <div>Filter search</div>)
);

jest.mock(
  '@/components/page-filters/page-filters-fields/page-filters-fields',
  () => jest.fn(() => <div>Filter fields</div>)
);

jest.mock(
  '@/components/page-filters/page-filters-toggle/page-filters-toggle',
  () =>
    jest.fn((props: PageFiltersToggleProps) => (
      <button onClick={props.onClick}>Filter toggle</button>
    ))
);

jest.mock('../workflows-query-input/workflows-query-input', () =>
  jest.fn(() => <div>Query input</div>)
);

const mockSetQueryParams = jest.fn();
const mockResetAllFilters = jest.fn();
const mockActiveFiltersCount = 2;
jest.mock('@/components/page-filters/hooks/use-page-filters', () =>
  jest.fn(() => ({
    resetAllFilters: mockResetAllFilters,
    activeFiltersCount: mockActiveFiltersCount,
    queryParams: mockDomainPageQueryParamsValues,
    setQueryParams: mockSetQueryParams,
  }))
);

jest.mock('../../hooks/use-list-workflows/use-list-workflows', () =>
  jest.fn(() => ({
    refetch: jest.fn(),
  }))
);

describe(WorkflowsHeader.name, () => {
  it('renders segmented control', async () => {
    setup({});

    expect(await screen.findByText('Search')).toBeInTheDocument();
    expect(await screen.findByText('Query')).toBeInTheDocument();
  });

  it('renders page search and filters button when input type is search', async () => {
    setup({});

    expect(await screen.findByText('Filter search')).toBeInTheDocument();
    expect(await screen.findByText('Filter toggle')).toBeInTheDocument();
  });

  it('renders page filters when filter toggle is clicked', async () => {
    const { user } = setup({});

    const filterToggle = await screen.findByText('Filter toggle');
    await user.click(filterToggle);

    expect(await screen.findByText('Filter fields')).toBeInTheDocument();
  });

  it('renders query input when input type is query', async () => {
    setup({
      filtersValuesOverrides: {
        inputType: 'query',
      },
    });

    expect(await screen.findByText('Query')).toBeInTheDocument();
  });

  it('toggles input type when segmented control is used', async () => {
    const { user } = setup({});

    const queryButton = await screen.findByText('Query');
    await user.click(queryButton);

    expect(mockSetQueryParams).toHaveBeenCalledWith(
      { inputType: 'query' },
      { pageRerender: true, replace: false }
    );
  });
});

function setup({
  filtersValuesOverrides,
}: {
  filtersValuesOverrides?: Partial<WorkflowsFiltersValues>;
}) {
  const user = userEvent.setup();
  const renderResult = render(
    <WorkflowsHeader
      domain="mock_domain"
      cluster="mock_cluster"
      pageQueryParamsConfig={domainPageQueryParamsConfig}
      pageFiltersConfig={mockFiltersConfig}
      filtersValues={{
        ...mockDomainPageQueryParamsValues,
        ...filtersValuesOverrides,
      }}
      inputTypeQueryParamKey="inputType"
      searchQueryParamKey="search"
      queryStringQueryParamKey="query"
    />
  );

  return { user, renderResult };
}
