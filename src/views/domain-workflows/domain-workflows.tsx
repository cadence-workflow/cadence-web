import React, { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import request from '@/utils/request';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import isClusterAdvancedVisibilityEnabled from './helpers/is-cluster-advanced-visibility-enabled';

const DomainWorkflowBasic = dynamic(
  () => import('@/views/domain-workflows-basic/domain-workflows-basic')
);
const DomainWorkflowsHeader = dynamic(
  () => import('./domain-workflows-header/domain-workflows-header')
);
const DomainWorkflowsTable = dynamic(
  () => import('./domain-workflows-table/domain-workflows-table')
);

export default function DomainWorkflows(props: DomainPageTabContentProps) {
  const { data } = useSuspenseQuery<DescribeClusterResponse>({
    queryKey: ['describeCluster', props],
    queryFn: () =>
      request(`/api/clusters/${props.cluster}`).then((res) => res.json()),
  });

  const isAdvancedVisibilityEnabled = useMemo(() => {
    return isClusterAdvancedVisibilityEnabled(data);
  }, [data]);

  if (!isAdvancedVisibilityEnabled) {
    return (
      <DomainWorkflowBasic domain={props.domain} cluster={props.cluster} />
    );
  }
  return (
    <>
      <DomainWorkflowsHeader domain={props.domain} cluster={props.cluster} />
      <DomainWorkflowsTable domain={props.domain} cluster={props.cluster} />
    </>
  );
}
