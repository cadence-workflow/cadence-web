import React, { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import request from '@/utils/request';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import isClusterAdvancedVisibilityEnabled from './helpers/is-cluster-advanced-visibility-enabled';

const DomainWorkflowsBasic = dynamic(
  () => import('@/views/domain-workflows-basic/domain-workflows-basic')
);

const DomainWorkflowsAdvanced = dynamic(
  () => import('./domain-workflows-advanced/domain-workflows-advanced')
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

  const DomainWorkflowsComponent = isAdvancedVisibilityEnabled
    ? DomainWorkflowsAdvanced
    : DomainWorkflowsBasic;

  return (
    <DomainWorkflowsComponent domain={props.domain} cluster={props.cluster} />
  );
}
