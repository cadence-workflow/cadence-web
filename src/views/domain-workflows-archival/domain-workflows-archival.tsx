import React, { useMemo } from 'react';

import dayjs from 'dayjs';

import getDayjsFromDateFilterValue from '@/components/date-filter-v2/helpers/get-dayjs-from-date-filter-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import domainPageQueryParamsConfig from '../domain-page/config/domain-page-query-params.config';
import useSuspenseDomainDescription from '../shared/hooks/use-domain-description/use-suspense-domain-description';

import DomainWorkflowsArchivalDisabledPanel from './domain-workflows-archival-disabled-panel/domain-workflows-archival-disabled-panel';
import DomainWorkflowsArchivalHeader from './domain-workflows-archival-header/domain-workflows-archival-header';
import DomainWorkflowsArchivalTable from './domain-workflows-archival-table/domain-workflows-archival-table';

export default function DomainWorkflowsArchival(
  props: DomainPageTabContentProps
) {
  const {
    data: { historyArchivalStatus, visibilityArchivalStatus },
  } = useSuspenseDomainDescription(props);

  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const timeRangeParams = useMemo(() => {
    const now = dayjs();

    return {
      timeRangeStart: getDayjsFromDateFilterValue(
        queryParams.timeRangeStartArchival,
        now
      ).toISOString(),
      timeRangeEnd: getDayjsFromDateFilterValue(
        queryParams.timeRangeEndArchival,
        now
      ).toISOString(),
    };
  }, [queryParams.timeRangeStartArchival, queryParams.timeRangeEndArchival]);

  if (
    historyArchivalStatus !== 'ARCHIVAL_STATUS_ENABLED' ||
    visibilityArchivalStatus !== 'ARCHIVAL_STATUS_ENABLED'
  ) {
    return <DomainWorkflowsArchivalDisabledPanel />;
  }

  return (
    <>
      <DomainWorkflowsArchivalHeader
        domain={props.domain}
        cluster={props.cluster}
        {...timeRangeParams}
      />
      <DomainWorkflowsArchivalTable
        domain={props.domain}
        cluster={props.cluster}
        {...timeRangeParams}
      />
    </>
  );
}
