"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Cell, Grid } from 'baseui/layout-grid';

import Table from '@/layout/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import sortBy, { SortByReturnValue, toggleSortOrder } from '@/utils/sort-by';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import DomainTableEndMessage from '@/containers/domains-page/domains-table-end-message/domains-table-end-message';
import domainPageQueryParamsConfig from '../config/domains-page-query-params';

import { domainTableColumns } from '../config/domains-table-columns-config';

import type { DomainData } from '../domains-page.types';
import { SortingOrder } from '@/layout/table/table.types';
import { Props } from './domains-table.types';
import { cssStyles } from './domains-table.styles';
import { useInView } from 'react-intersection-observer';




const DOMAINS_LIST_PAGE_SIZE = 20;

function DomainsTable({ domains, tableColumns = domainTableColumns }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [visibleListItems, setVisibleListItems] = useState(Math.min(DOMAINS_LIST_PAGE_SIZE, domains.length));

  const [queryParams, setQueryParams] = usePageQueryParams(domainPageQueryParamsConfig, { pageRerender: false });

  useEffect(() => {
    setVisibleListItems(DOMAINS_LIST_PAGE_SIZE);
  }, [queryParams]);

  const filteredDomains = useMemo(
    () => {
      const lowerCaseSearch = queryParams.searchText?.toLowerCase();
      const clusterName = queryParams.clusterName
      return domains.filter(
        ({ id, name, clusters }) =>
          (!lowerCaseSearch ||
            id.toLowerCase().includes(lowerCaseSearch) ||
            name.toLowerCase().includes(lowerCaseSearch))
          && (!clusterName || clusters.find((c) => c.clusterName === clusterName))
      );
    },
    [domains, queryParams.searchText, queryParams.clusterName]
  );
  const sortedDomains = useMemo(
    () => sortBy<DomainData>(filteredDomains, (d) => (d[queryParams.sortColumn as keyof DomainData] as SortByReturnValue), queryParams.sortOrder),
    [filteredDomains, queryParams.sortColumn, queryParams.sortOrder]
  );
  const paginatedDomains = useMemo(
    () => sortedDomains.slice(0, visibleListItems),
    [sortedDomains, visibleListItems]
  );

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && visibleListItems < sortedDomains.length) {
        setVisibleListItems((v) => Math.min(v + DOMAINS_LIST_PAGE_SIZE, sortedDomains.length));
      }
    }
  });

  return (
    <section className={cls.tableContainer}>
      <Grid>
        <Cell span={12}>
          <Table
            data={paginatedDomains}
            columns={tableColumns}
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
            endMessage={<DomainTableEndMessage
              key={visibleListItems}
              canLoadMoreResults={paginatedDomains.length < sortedDomains.length}
              hasSearchResults={sortedDomains.length > 0}
              infiniteScrollTargetRef={loadMoreRef}
            />}
          />
        </Cell>
      </Grid>
    </section>
  );
}

export default DomainsTable;
