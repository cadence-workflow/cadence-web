import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type Props = {
  params: { domain: string; cluster: string };
  children: React.ReactNode;
};

// TODO @adhitya.mamallan - use GRPC types when they are ready
export type DomainInfo = {
  name: string;
  status: string;
  description?: string;
  ownerEmail?: string;
  data?: { [x: string]: string };
  id: string;
  activeClusterName: string;
  clusters: ClusterReplicationConfiguration[];
  isGlobalDomain: boolean;
};

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
