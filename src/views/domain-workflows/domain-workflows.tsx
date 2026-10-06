'use client';
import React from 'react';

import dynamic from 'next/dynamic';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';
import useSuspenseUserInfo from '@/views/shared/hooks/use-user-info/use-suspense-user-info';

import DomainWorkflowsClusterGate from './domain-workflows-cluster-gate/domain-workflows-cluster-gate';

const DomainWorkflowsBasic = dynamic(
  () => import('@/views/domain-workflows-basic/domain-workflows-basic')
);

export default function DomainWorkflows(props: DomainPageTabContentProps) {
  const { data: authInfo } = useSuspenseUserInfo();

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
