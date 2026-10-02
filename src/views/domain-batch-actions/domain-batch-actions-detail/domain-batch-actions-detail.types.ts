import { type BatchAction } from '../domain-batch-actions.types';

export type Props = {
  domain: string;
  cluster: string;
  workflowId: string;
  batchAction?: BatchAction;
  loading?: boolean;
};
