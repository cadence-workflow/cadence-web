'use client';
import React from 'react';

import { useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import { type WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

import buildWorkflowPageClusterPath from './helpers/build-workflow-page-cluster-path';
import type { Props } from './workflow-page-header-cluster-selector.types';

export default function WorkflowPageHeaderClusterSelector({
  domain,
  cluster,
}: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const encodedParams = useParams<WorkflowPageTabsParams>();
  const decodedParams = decodeUrlParams(
    encodedParams
  ) as WorkflowPageTabsParams;

  const buildPathForCluster = (newCluster: string) =>
    buildWorkflowPageClusterPath({
      domain,
      cluster: newCluster,
      workflowId: decodedParams.workflowId,
      runId: decodedParams.runId,
      workflowTab: decodedParams.workflowTab,
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
