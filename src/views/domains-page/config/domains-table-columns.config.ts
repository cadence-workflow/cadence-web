import { TableColumn } from '@/components/table/table.types';
import { DomainData } from '../domains-page.types';
import DomainsTableClusterCell from '../domains-table-cluster-cell/domains-table-cluster-cell';
import DomainsTableDomainNameCell from '../domains-table-domain-name-cell/domains-table-domain-name-cell';

const domainsTableColumnsConfig: Array<TableColumn<DomainData>> = [
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
];

export default domainsTableColumnsConfig;
