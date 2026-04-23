import { render, screen } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainWorkflowsAdvanced from '../domain-workflows-advanced';

jest.mock(
  '@/components/date-filter/helpers/get-dayjs-from-date-filter-value',
  () =>
    jest.fn(() => ({
      toISOString: () => '2024-03-20T00:00:00.000Z',
    }))
);

jest.mock('../../domain-workflows-header/domain-workflows-header', () =>
  jest.fn(
    ({ domain, cluster, columnsPickerProps, timeRangeStart, timeRangeEnd }) => (
      <div data-testid="workflows-header">
        <div>Header Domain: {domain}</div>
        <div>Header Cluster: {cluster}</div>
        <div>
          Header Has Columns Picker: {columnsPickerProps ? 'true' : 'false'}
        </div>
        <div>Header Time Range Start: {timeRangeStart}</div>
        <div>Header Time Range End: {timeRangeEnd}</div>
      </div>
    )
  )
);

jest.mock('../../domain-workflows-table/domain-workflows-table', () =>
  jest.fn(({ domain, cluster, timeRangeStart, timeRangeEnd }) => (
    <div data-testid="workflows-table">
      <div>Table Domain: {domain}</div>
      <div>Table Cluster: {cluster}</div>
      <div>Table Time Range Start: {timeRangeStart}</div>
      <div>Table Time Range End: {timeRangeEnd}</div>
    </div>
  ))
);

jest.mock('../../domain-workflows-list/domain-workflows-list', () =>
  jest.fn(({ domain, cluster, timeRangeStart, timeRangeEnd }) => (
    <div data-testid="workflows-list">
      <div>List Domain: {domain}</div>
      <div>List Cluster: {cluster}</div>
      <div>List Time Range Start: {timeRangeStart}</div>
      <div>List Time Range End: {timeRangeEnd}</div>
    </div>
  ))
);

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

describe(DomainWorkflowsAdvanced.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render header and table when isNewWorkflowsListEnabled is false', async () => {
    setup({ isNewWorkflowsListEnabled: false });

    const header = screen.getByTestId('workflows-header');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Header Domain: test-domain')).toBeInTheDocument();
    expect(
      screen.getByText('Header Cluster: test-cluster')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Header Has Columns Picker: false')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Header Time Range Start: 2024-03-20T00:00:00.000Z')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Header Time Range End: 2024-03-20T00:00:00.000Z')
    ).toBeInTheDocument();

    const table = screen.getByTestId('workflows-table');
    expect(table).toBeInTheDocument();
    expect(screen.getByText('Table Domain: test-domain')).toBeInTheDocument();
    expect(screen.getByText('Table Cluster: test-cluster')).toBeInTheDocument();
    expect(
      screen.getByText('Table Time Range Start: 2024-03-20T00:00:00.000Z')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Table Time Range End: 2024-03-20T00:00:00.000Z')
    ).toBeInTheDocument();

    expect(screen.queryByTestId('workflows-list')).not.toBeInTheDocument();
  });

  it('should render header with columnsPickerProps and list when isNewWorkflowsListEnabled is true', async () => {
    setup({ isNewWorkflowsListEnabled: true });

    const header = screen.getByTestId('workflows-header');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Header Domain: test-domain')).toBeInTheDocument();
    expect(
      screen.getByText('Header Cluster: test-cluster')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Header Has Columns Picker: true')
    ).toBeInTheDocument();

    const list = screen.getByTestId('workflows-list');
    expect(list).toBeInTheDocument();
    expect(screen.getByText('List Domain: test-domain')).toBeInTheDocument();
    expect(screen.getByText('List Cluster: test-cluster')).toBeInTheDocument();
    expect(
      screen.getByText('List Time Range Start: 2024-03-20T00:00:00.000Z')
    ).toBeInTheDocument();
    expect(
      screen.getByText('List Time Range End: 2024-03-20T00:00:00.000Z')
    ).toBeInTheDocument();

    expect(screen.queryByTestId('workflows-table')).not.toBeInTheDocument();
  });
});

function setup({
  isNewWorkflowsListEnabled,
}: {
  isNewWorkflowsListEnabled: boolean;
}) {
  render(
    <DomainWorkflowsAdvanced
      domain="test-domain"
      cluster="test-cluster"
      isNewWorkflowsListEnabled={isNewWorkflowsListEnabled}
    />
  );
}
