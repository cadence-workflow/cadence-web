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
    queryKey: ['describeCluster', props.cluster],
    queryFn: () =>
      request(`/api/clusters/${props.cluster}`).then((res) => res.json()),
    enabled: shouldFetchClusterInfo,
    retry: false,
  });

  const { data: isAdvancedVisibilityAvailableForNonAdmin } = useQuery<boolean>({
    queryKey: ['probeAdvancedVisibility', props.domain, props.cluster],
    queryFn: async () => {
      try {
        await request(
          `/api/domains/${props.domain}/${props.cluster}/workflows?listType=default&inputType=search&timeColumn=StartTime&pageSize=1`
        );
        return true;
      } catch {
        return false;
      }
    },
    enabled: Boolean(authInfo) && isAuthenticatedNonAdmin,
    retry: false,
  });

  const isAdvancedVisibilityEnabled = useMemo(() => {
    // Non-admin authenticated users may not be allowed to call describeCluster,
    // so we probe the workflows API instead.
    if (isAuthenticatedNonAdmin) {
      return isAdvancedVisibilityAvailableForNonAdmin ?? false;
    }
    if (!clusterInfo) return false;
    return isClusterAdvancedVisibilityEnabled(clusterInfo);
  }, [
    clusterInfo,
    isAdvancedVisibilityAvailableForNonAdmin,
    isAuthenticatedNonAdmin,
  ]);

  if (
    isAuthLoading ||
    (isAuthenticatedNonAdmin &&
      isAdvancedVisibilityAvailableForNonAdmin === undefined)
  ) {
    return null;
  }

  const DomainWorkflowsComponent = isAdvancedVisibilityEnabled
    ? DomainWorkflowsAdvanced
    : DomainWorkflowsBasic;

  return (
    <DomainWorkflowsComponent domain={props.domain} cluster={props.cluster} />
  );
}
