import { useMemo } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter-v2/helpers/get-dayjs-from-date-filter-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import dayjs from '@/utils/datetime/dayjs';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import DomainWorkflowsHeader from '../domain-workflows-header/domain-workflows-header';
import DomainWorkflowsTable from '../domain-workflows-table/domain-workflows-table';

import { type Props } from './domain-workflows-advanced.types';

export default function DomainWorkflowsAdvanced({ domain, cluster }: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const timeRangeParams = useMemo(() => {
    const now = dayjs();

    return {
      timeRangeStart: getDayjsFromDateFilterValue(
        queryParams.timeRangeStart,
        now
      ).toISOString(),
      timeRangeEnd: getDayjsFromDateFilterValue(
        queryParams.timeRangeEnd,
        now
      ).toISOString(),
    };
  }, [queryParams.timeRangeStart, queryParams.timeRangeEnd]);

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
