'use client';
import React, { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import useUserInfo from '@/hooks/use-user-info/use-user-info';
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
  const { data: authInfo, isLoading: isAuthLoading } = useUserInfo();

  const isAdmin = authInfo?.isAdmin === true;
  const isAuthEnabled = authInfo?.authEnabled === true;
  const isAuthenticated = authInfo?.isAuthenticated === true;
  const isAuthenticatedNonAdmin = isAuthEnabled && isAuthenticated && !isAdmin;

  const shouldFetchClusterInfo =
    Boolean(authInfo) && (!isAuthEnabled || isAdmin);

  const { data: clusterInfo } = useQuery<DescribeClusterResponse>({
    queryKey: ['describeCluster', props],
    queryFn: () =>
      request(`/api/clusters/${props.cluster}`).then((res) => res.json()),
    enabled: shouldFetchClusterInfo,
    retry: false,
  });

  const isAdvancedVisibilityEnabled = useMemo(() => {
    // Non-admin authenticated users may not be allowed to call describeCluster,
    // but can still have access to advanced visibility APIs.
    if (isAuthenticatedNonAdmin) {
      return true;
    }
    if (!clusterInfo) return false;
    return isClusterAdvancedVisibilityEnabled(clusterInfo);
  }, [clusterInfo, isAuthenticatedNonAdmin]);

  if (isAuthLoading) {
    return null;
  }

  const DomainWorkflowsComponent = isAdvancedVisibilityEnabled
    ? DomainWorkflowsAdvanced
    : DomainWorkflowsBasic;

  return (
    <DomainWorkflowsComponent domain={props.domain} cluster={props.cluster} />
  );
}
