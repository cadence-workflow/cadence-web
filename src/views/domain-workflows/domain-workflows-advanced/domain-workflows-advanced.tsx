import { useMemo } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter/helpers/get-dayjs-from-date-filter-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import dayjs from '@/utils/datetime/dayjs';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useWorkflowsListColumns from '@/views/shared/workflows-list/hooks/use-workflows-list-columns';

import DomainWorkflowsHeader from '../domain-workflows-header/domain-workflows-header';
import DomainWorkflowsList from '../domain-workflows-list/domain-workflows-list';
import DomainWorkflowsTable from '../domain-workflows-table/domain-workflows-table';

import { type Props } from './domain-workflows-advanced.types';

export default function DomainWorkflowsAdvanced({
  domain,
  cluster,
  isNewWorkflowsListEnabled,
}: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const {
    availableColumns,
    visibleColumns,
    selectedColumnIds,
    setSelectedColumnIds,
    resetColumns,
  } = useWorkflowsListColumns({ cluster });

  const timeRangeParams = useMemo(() => {
    const now = dayjs();

    return {
      timeRangeStart: queryParams.timeRangeStart
        ? getDayjsFromDateFilterValue(
            queryParams.timeRangeStart,
            now
          ).toISOString()
        : undefined,
      timeRangeEnd: getDayjsFromDateFilterValue(
        queryParams.timeRangeEnd,
        now
      ).toISOString(),
    };
  }, [queryParams.timeRangeStart, queryParams.timeRangeEnd]);

  if (isNewWorkflowsListEnabled) {
    return (
      <>
        <DomainWorkflowsHeader
          domain={domain}
          cluster={cluster}
          columnsPickerProps={{
            allColumns: availableColumns,
            selectedColumnIds,
            onApply: setSelectedColumnIds,
            onReset: resetColumns,
          }}
          {...timeRangeParams}
        />
        <DomainWorkflowsList
          domain={domain}
          cluster={cluster}
          visibleColumns={visibleColumns}
          {...timeRangeParams}
        />
      </>
    );
  }

  return (
    <>
      <DomainWorkflowsHeader
        domain={domain}
        cluster={cluster}
        {...timeRangeParams}
      />
      <DomainWorkflowsTable
        domain={domain}
        cluster={cluster}
        {...timeRangeParams}
      />
    </>
  );
}
