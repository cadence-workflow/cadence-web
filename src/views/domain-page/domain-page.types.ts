import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type Props = {
  params: { domain: string; cluster: string };
  children: React.ReactNode;
};

export type DomainDescription = DescribeDomainResponse;

export type ClusterReplicationConfiguration = {
  clusterName: string;
};

export type DomainWorkflow = {
  workflowID: string;
  runID: string;
  workflowName: string;
  status: WorkflowStatus;
  startTime: number;
  closeTime: number | null | undefined;
};
