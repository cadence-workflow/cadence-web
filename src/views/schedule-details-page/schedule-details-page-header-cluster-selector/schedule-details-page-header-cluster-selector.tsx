'use client';
import React from 'react';

import { useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import { type ScheduleDetailsPageTabsParams } from '../schedule-details-page-tabs/schedule-details-page-tabs.types';

import buildScheduleDetailsPageClusterPath from './helpers/build-schedule-details-page-cluster-path';
import type { Props } from './schedule-details-page-header-cluster-selector.types';

export default function ScheduleDetailsPageHeaderClusterSelector({
  domain,
  cluster,
}: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const encodedParams = useParams<ScheduleDetailsPageTabsParams>();
  const decodedParams = decodeUrlParams(
    encodedParams
  ) as ScheduleDetailsPageTabsParams;

  const buildPathForCluster = (newCluster: string) =>
    buildScheduleDetailsPageClusterPath({
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
