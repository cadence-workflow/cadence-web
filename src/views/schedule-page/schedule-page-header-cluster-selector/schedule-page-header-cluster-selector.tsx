'use client';
import React from 'react';

import { useParams } from 'next/navigation';

import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import { type SchedulePageTabsParams } from '../schedule-page-tabs/schedule-page-tabs.types';

import buildSchedulePageClusterPath from './helpers/build-schedule-page-cluster-path';
import type { Props } from './schedule-page-header-cluster-selector.types';
import decodeUrlParams from '@/utils/decode-url-params';

export default function SchedulePageHeaderClusterSelector({
  domain,
  cluster,
}: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const routeParams = useParams<SchedulePageTabsParams>();
  const decodedParams = decodeUrlParams(routeParams) as SchedulePageTabsParams;

  const buildPathForCluster = (newCluster: string) =>
    buildSchedulePageClusterPath({
      domain,
      cluster: newCluster,
      scheduleId: decodedParams.scheduleId,
      scheduleTab: decodedParams.scheduleTab,
    });

  return (
    <DomainClusterSelector
      domainDescription={domainDescription}
      cluster={cluster}
      buildPathForCluster={buildPathForCluster}
      singleClusterFallbackType="none"
      noSpacing={true}
    />
  );
}
