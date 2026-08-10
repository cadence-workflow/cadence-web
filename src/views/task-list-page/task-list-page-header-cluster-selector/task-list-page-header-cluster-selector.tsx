'use client';
import React from 'react';

import { useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import { type RouteParams } from '../task-list-page.types';

import buildTaskListPageClusterPath from './helpers/build-task-list-page-cluster-path';
import type { Props } from './task-list-page-header-cluster-selector.types';

export default function TaskListPageHeaderClusterSelector({
  domain,
  cluster,
}: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const encodedParams = useParams<RouteParams>();
  const decodedParams = decodeUrlParams(encodedParams) as RouteParams;

  const buildPathForCluster = (newCluster: string) =>
    buildTaskListPageClusterPath({
      domain,
      cluster: newCluster,
      taskListName: decodedParams.taskListName,
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
