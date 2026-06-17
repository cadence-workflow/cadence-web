import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

import { type BatchActionProgress } from '../domain-batch-actions.types';

export type Props = {
  status: BatchActionStatus;
  progress?: BatchActionProgress;
};
