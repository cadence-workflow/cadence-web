'use client';
import React, { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import request from '@/utils/request';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflowsAdvancedGate from './domain-workflows-advanced-gate';
import DomainWorkflowsBasic from './domain-workflows-basic-lazy';
import isClusterAdvancedVisibilityEnabled from './helpers/is-cluster-advanced-visibility-enabled';

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

  return <DomainWorkflowsAdvancedGate {...props} />;
}
