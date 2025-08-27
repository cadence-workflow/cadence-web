import { render, screen } from '@/test-utils/rtl';

import { type Props as SublistTableProps } from '@/components/list-table-nested/sublist-table/sublist-table.types';
import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import { mockDomainDescription } from '../../__fixtures__/domain-description';
import DomainPageMetadataFailoverVersion from '../domain-page-metadata-failover-version';

jest.mock('@/components/list-table-nested/sublist-table/sublist-table', () =>
  jest.fn(({ items }: SublistTableProps) => (
    <div data-testid="mock-sublist-table">{JSON.stringify(items)}</div>
  ))
);

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe(DomainPageMetadataFailoverVersion.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders failover version as text for non-active-active domains', () => {
    render(<DomainPageMetadataFailoverVersion {...mockDomainDescription} />);

    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-sublist-table')).not.toBeInTheDocument();
  });

  it('renders SublistTable for active-active domains', () => {
    render(<DomainPageMetadataFailoverVersion {...mockActiveActiveDomain} />);

    const sublistTable = screen.getByTestId('mock-sublist-table');
    expect(sublistTable).toBeInTheDocument();
    expect(sublistTable).toHaveTextContent(
      /{"key":"cluster0","label":"cluster0","value":"0"}/
    );
    expect(sublistTable).toHaveTextContent(
      /{"key":"cluster1","label":"cluster1","value":"2"}/
    );
  });
});
