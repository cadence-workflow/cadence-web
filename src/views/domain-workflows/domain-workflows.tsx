'use client';
import React, { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import { type PublicAuthContext } from '@/utils/auth/auth-shared.types';
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
  const { data: authInfo } = useSuspenseQuery<PublicAuthContext>({
    queryKey: ['auth-me'],
    queryFn: () => request('/api/auth/me').then((res) => res.json()),
  });

  // Non-admin authenticated users may not be allowed to call describeCluster,
  // so default them to the basic workflows view.
  // TODO: Revisit once https://github.com/cadence-workflow/cadence/issues/7784 is resolved.
  if (authInfo.authEnabled && !authInfo.isAdmin && authInfo.auth.isValidToken) {
    return (
      <DomainWorkflowsBasic domain={props.domain} cluster={props.cluster} />
    );
  }

  return <DomainWorkflowsClusterGate {...props} />;
}

function DomainWorkflowsClusterGate(props: DomainPageTabContentProps) {
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

function DomainWorkflowsAdvancedGate(props: DomainPageTabContentProps) {
  const { data: isNewWorkflowsListEnabled } = useSuspenseConfigValue(
    'WORKFLOWS_LIST_ENABLED'
  );

  return (
    <DomainWorkflowsAdvanced
      domain={props.domain}
      cluster={props.cluster}
      isNewWorkflowsListEnabled={isNewWorkflowsListEnabled}
    />
  );
}
