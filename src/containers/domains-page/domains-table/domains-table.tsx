"use client";
import React, { useMemo } from 'react';
import Image from 'next/image'
import cadenceIcon from '@/assets/cadence-logo.svg';

import type { DomainData, SortingOrder } from '../domains-page.types';
import TableLink from './domains-table-link';
import Table from '@/layout/table';
import domainPageQueryParamsConfig from '../domains-page-query-params';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import sortBy, { SortByReturnValue, toggleSortOrder } from '@/utils/sort-by';
import useStyletronClasses from '@/hooks/useStyletronClasses';
import { cssStyles } from './domains-table.styles';
import { Cell, Grid } from 'baseui/layout-grid';


type Props = {
  domains: Array<DomainData>;
};

function DomainsTable({ domains }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const [queryParams, setQueryParams] = usePageQueryParams(domainPageQueryParamsConfig, { pageRerender: false });

  const filteredDomains = useMemo(
    () => {
      const lowerCaseSearch = queryParams.searchText?.toLowerCase();
      return domains.filter(
        ({ id, name }) =>
        (!lowerCaseSearch ||
          id.toLowerCase().includes(lowerCaseSearch) ||
          name.toLowerCase().includes(lowerCaseSearch))
      );
    },
    [domains, queryParams.searchText]
  );
  const sortedDomains = useMemo(
    () => sortBy<DomainData>(filteredDomains, (d) => (d[queryParams.sortColumn as keyof DomainData] as SortByReturnValue), queryParams.sortOrder),
    [filteredDomains, queryParams.sortColumn, queryParams.sortOrder]
  );

  const columns = [

    {
      name: 'Domain Name',
      id: 'name',
      renderCell: (row: DomainData) => (
        <div className={cls.domainNameCell}>
          <Image width={16} height={16} alt='Cadence Icon' src={cadenceIcon} />
          <TableLink href={"a"}>{row.name}</TableLink>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Cluster',
      id: 'cluster',
      renderCell: (row: DomainData) => (
        <div className={cls.clustersLinks}>
          {row.clusters.length > 1 && row.clusters.map(({ clusterName }) => <TableLink key={clusterName} href={"/"}>{clusterName}</TableLink>)}
          {row.clusters.length === 1 && row.clusters[0]?.clusterName}
        </div>
      ),
    },
    {
      name: '',
      id: 'metrics',
      renderCell: () => <div className={cls.metricLinkContainer}><TableLink href={"/"}>Metrics</TableLink></div>,
    },
  ]

  return (
    <section className={cls.tableContainer}>
      <Grid>
        <Cell span={12}>
          <Table
            data={sortedDomains}
            columns={columns}
            shouldShowResults={true}
            onSort={(columnID) => setQueryParams({
              sortColumn: columnID,
              sortOrder: toggleSortOrder({
                currentSortColumn: queryParams.sortColumn,
                currentSortOrder: queryParams.sortOrder,
                newSortColumn: columnID,
              }),
            })}
            sortColumn={queryParams.sortColumn}
            sortOrder={queryParams.sortOrder as SortingOrder}
            endMessage={null}
          />
        </Cell>
      </Grid>
    </section>
  );
}

export default DomainsTable;
