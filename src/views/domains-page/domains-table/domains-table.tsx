'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Cell, Grid } from 'baseui/layout-grid';
import { useInView } from 'react-intersection-observer';

import Table from '@/components/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import sortBy, {
  type SortByReturnValue,
  toggleSortOrder,
  type SortOrder,
} from '@/utils/sort-by';
import DomainsTableEndMessage from '@/views/domains-page/domains-table-end-message/domains-table-end-message';

import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import domainsTableColumnsConfig from '../config/domains-table-columns.config';
import type { DomainData } from '../domains-page.types';

import { cssStyles } from './domains-table.styles';
import { type Props } from './domains-table.types';

const DOMAINS_LIST_PAGE_SIZE = 20;

function DomainsTable({
  domains,
  tableColumns = domainsTableColumnsConfig,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [visibleListItems, setVisibleListItems] = useState(
    Math.min(DOMAINS_LIST_PAGE_SIZE, domains.length)
  );

  const [queryParams, setQueryParams] = usePageQueryParams(
    domainsPageQueryParamsConfig,
    { pageRerender: false }
  );

  useEffect(() => {
    setVisibleListItems(DOMAINS_LIST_PAGE_SIZE);
  }, [queryParams]);

  const filteredDomains = useMemo(() => {
    const lowerCaseSearch = queryParams.searchText?.toLowerCase();
    return domains.filter(
      (d) =>
        (!lowerCaseSearch ||
          d.id.toLowerCase().includes(lowerCaseSearch) ||
          d.name.toLowerCase().includes(lowerCaseSearch)) &&
        domainsPageFiltersConfig.every((f) => f.filterFunc(d, queryParams))
    );
  }, [domains, queryParams]);
  const sortedDomains = useMemo(() => {
    if (!queryParams.sortColumn || !queryParams.sortOrder)
      return filteredDomains;
    return sortBy<DomainData>(
      filteredDomains,
      (d) => d[queryParams.sortColumn as keyof DomainData] as SortByReturnValue,
      queryParams.sortOrder
    );
  }, [filteredDomains, queryParams.sortColumn, queryParams.sortOrder]);
  const paginatedDomains = useMemo(
    () => sortedDomains.slice(0, visibleListItems),
    [sortedDomains, visibleListItems]
  );

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && visibleListItems < sortedDomains.length) {
        setVisibleListItems((v) =>
          Math.min(v + DOMAINS_LIST_PAGE_SIZE, sortedDomains.length)
        );
      }
    },
  });

  return (
    <section className={cls.tableContainer}>
      <Grid>
        <Cell span={12}>
          <Table
            data={paginatedDomains}
            columns={tableColumns}
            shouldShowResults={true}
            onSort={(columnID) =>
              setQueryParams({
                sortColumn: columnID,
                sortOrder: toggleSortOrder({
                  currentSortColumn: queryParams.sortColumn,
                  currentSortOrder: queryParams.sortOrder,
                  newSortColumn: columnID,
                }),
              })
            }
            sortColumn={queryParams.sortColumn}
            sortOrder={queryParams.sortOrder as SortOrder}
            endMessage={
              <DomainsTableEndMessage
                key={visibleListItems}
                canLoadMoreResults={
                  paginatedDomains.length < sortedDomains.length
                }
                hasSearchResults={sortedDomains.length > 0}
                infiniteScrollTargetRef={loadMoreRef}
              />
            }
          />
        </Cell>
      </Grid>
    </section>
  );
}

export default DomainsTable;
