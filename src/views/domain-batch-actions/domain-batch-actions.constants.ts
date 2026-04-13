import { type BatchAction } from './domain-batch-actions.types';

export const MOCK_BATCH_ACTIONS: BatchAction[] = [
  { id: 5, status: 'running', progress: 60 },
  { id: 4, status: 'completed' },
  { id: 3, status: 'completed' },
  { id: 2, status: 'completed' },
  { id: 1, status: 'aborted' },
];
