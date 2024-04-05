import { TableColumn } from "@/layout/table";
import { DomainData } from "../domains-page.types";
import DomainsTableClusterCell from "../domains-table-cluster-cell/domains-table-cluster-cell";
import DomainsTableDomainNameCell from "../domains-table-domain-name-cell/domains-table-domain-name-cell";

export const domainTableColumns: Array<TableColumn<DomainData>> = [
    {
        name: 'Domain Name',
        id: 'name',
        renderCell: DomainsTableDomainNameCell,
        sortable: true,
    },
    {
        name: 'Cluster',
        id: 'cluster',
        renderCell: DomainsTableClusterCell,
    }
] 