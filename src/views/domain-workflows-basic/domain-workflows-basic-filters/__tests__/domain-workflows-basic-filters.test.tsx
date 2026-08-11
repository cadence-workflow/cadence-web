import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as PageFiltersToggleProps } from '@/components/page-filters/page-filters-toggle/page-filters-toggle.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainWorkflowsBasicFilters from '../domain-workflows-basic-filters';

jest.mock(
  '@/components/page-filters/page-filters-search/page-filters-search',
  () =>
    jest.fn(({ searchPlaceholder }) => (
      <div>Filter search: {searchPlaceholder}</div>
    ))
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

describe(DomainWorkflowsBasicFilters.name, () => {
  it('renders page search and filters', async () => {
    setup();

    expect(
      await screen.findByText('Filter search: Workflow ID')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Filter search: Workflow Type')
    ).toBeInTheDocument();

    expect(await screen.findByText('Filter fields')).toBeInTheDocument();
  });

  it('hides page filters when filter toggle is clicked', async () => {
    const { user } = setup();

    expect(await screen.findByText('Filter fields')).toBeInTheDocument();

    const filterToggle = await screen.findByText('Filter toggle');
    await user.click(filterToggle);

    expect(screen.queryByText('Filter fields')).toBeNull();
  });
});

function setup() {
  const user = userEvent.setup();

  render(
    <DomainWorkflowsBasicFilters
      resetAllFilters={jest.fn()}
      activeFiltersCount={2}
      queryParams={mockDomainPageQueryParamsValues}
      setQueryParams={jest.fn()}
    />
  );

  return { user };
}
