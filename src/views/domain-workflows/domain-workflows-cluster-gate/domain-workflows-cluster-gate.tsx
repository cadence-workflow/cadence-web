'use client';
import React, { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import request from '@/utils/request';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflowsAdvancedGate from '../domain-workflows-advanced-gate/domain-workflows-advanced-gate';
import isClusterAdvancedVisibilityEnabled from '../helpers/is-cluster-advanced-visibility-enabled';

const DomainWorkflowsBasic = dynamic(
  () => import('@/views/domain-workflows-basic/domain-workflows-basic')
);

export default function DomainWorkflowsClusterGate(
  props: DomainPageTabContentProps
) {
  const { data: clusterInfo } = useSuspenseQuery<DescribeClusterResponse>({
    queryKey: ['describeCluster', props.cluster],
    queryFn: () =>
      request(`/api/clusters/${props.cluster}`).then((res) => res.json()),
    retry: false,
  });

  const isAdvancedVisibilityEnabled = useMemo(() => {
    return isClusterAdvancedVisibilityEnabled(clusterInfo);
  }, [clusterInfo]);

  if (!isAdvancedVisibilityEnabled) {
    return (
      <DomainWorkflowsBasic domain={props.domain} cluster={props.cluster} />
    );
  }

  return (
    <DomainWorkflowsAdvancedGate
      domain={props.domain}
      cluster={props.cluster}
    />
  );
}
