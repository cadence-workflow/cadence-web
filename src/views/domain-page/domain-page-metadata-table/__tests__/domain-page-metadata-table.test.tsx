import { render, screen } from '@/test-utils/rtl';

import { type Props as ListTableProps } from '@/components/list-table/list-table.types';
import { type Props as ListTableNestedProps } from '@/components/list-table-nested/list-table-nested.types';

import { mockDomainMetadata } from '../../__fixtures__/domain-metadata';
import { type DomainMetadata } from '../../domain-page-metadata/domain-page-metadata.types';
import { type DomainDescription } from '../../domain-page.types';
import DomainPageMetadataTable from '../domain-page-metadata-table';

jest.mock('../../config/domain-page-metadata-table.config', () => [
  {
    key: 'id',
    label: 'Domain ID',
    renderValue: (domainDescription: DomainDescription) => domainDescription.id,
  },
  {
    key: 'activeClusterName',
    label: 'Active Cluster',
    renderValue: (domainDescription: DomainDescription) =>
      domainDescription.activeClusterName,
  },
]);

jest.mock('../../config/domain-page-metadata-extended-table.config', () => [
  {
    key: 'basic',
    label: 'Basic Information',
    description: 'Basic domain information',
    kind: 'group',
    items: [
      {
        key: 'id',
        label: 'Domain ID',
        getValue: (props: DomainMetadata) => props.domainDescription.id,
      },
      {
        key: 'activeClusterName',
        label: 'Active Cluster',
        getValue: (props: DomainMetadata) =>
          props.domainDescription.activeClusterName,
      },
    ],
  },
  {
    key: 'ownerEmail',
    label: 'Owner Email',
    description: 'Email address of the domain owner',
    getValue: (props: DomainMetadata) => props.domainDescription.ownerEmail,
  },
]);

jest.mock('@/components/list-table/list-table', () =>
  jest.fn(({ data, listTableConfig }: ListTableProps<object>) => (
    <div>
      Mock ListTable
      {listTableConfig.map((config) => (
        <div key={config.key}>
          {config.label}: <config.renderValue {...data} />
        </div>
      ))}
    </div>
  ))
);

jest.mock('@/components/list-table-nested/list-table-nested', () =>
  jest.fn(({ items }: ListTableNestedProps) => (
    <div>
      Mock ListTableNested
      {items.map((item) => (
        <div key={item.key}>
          <div>{item.label}</div>
          {item.description && <div>{item.description}</div>}
          {item.kind === 'group' ? (
            <div>
              {item.items.map((subItem) => (
                <div key={subItem.key}>
                  {subItem.label}: {subItem.value}
                </div>
              ))}
            </div>
          ) : (
            <div>{item.value}</div>
          )}
        </div>
      ))}
    </div>
  ))
);

describe(DomainPageMetadataTable.name, () => {
  it('renders basic metadata table when extended metadata is disabled', () => {
    render(<DomainPageMetadataTable {...mockDomainMetadata} />);

    expect(screen.getByText('Mock ListTable')).toBeInTheDocument();

    expect(
      screen.getByText('Domain ID: mock-domain-staging-uuid')
    ).toBeInTheDocument();
    expect(screen.getByText('Active Cluster: cluster_1')).toBeInTheDocument();
  });

  it('renders extended metadata table when extended metadata is enabled', () => {
    render(
      <DomainPageMetadataTable
        {...mockDomainMetadata}
        isExtendedMetadataEnabled={true}
      />
    );

    expect(screen.getByText('Mock ListTableNested')).toBeInTheDocument();

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Basic domain information')).toBeInTheDocument();
    expect(
      screen.getByText('Domain ID: mock-domain-staging-uuid')
    ).toBeInTheDocument();
    expect(screen.getByText('Active Cluster: cluster_1')).toBeInTheDocument();

    expect(screen.getByText('Owner Email')).toBeInTheDocument();
    expect(
      screen.getByText('Email address of the domain owner')
    ).toBeInTheDocument();
    expect(screen.getByText('mockdomainowner@gmail.com')).toBeInTheDocument();
  });
});
