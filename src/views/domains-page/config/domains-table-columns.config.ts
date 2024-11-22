import { type TableConfig } from '@/components/table/table.types';

import { type DomainData } from '../domains-page.types';
import DomainsTableClusterCell from '../domains-table-cluster-cell/domains-table-cluster-cell';
import DomainsTableDomainNameCell from '../domains-table-domain-name-cell/domains-table-domain-name-cell';

const domainsTableColumnsConfig = [
  {
    name: 'Domain Name',
    id: 'name',
    renderCell: DomainsTableDomainNameCell,
    width: '80%',
    sortable: true,
  },
  {
    name: 'Cluster',
    id: 'cluster',
    renderCell: DomainsTableClusterCell,
    width: '20%',
  },
] as const satisfies TableConfig<DomainData>;

export default domainsTableColumnsConfig;
