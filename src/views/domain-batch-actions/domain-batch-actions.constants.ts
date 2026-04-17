import { type BatchAction } from './domain-batch-actions.types';

// TODO: Replace with real API data
export const MOCK_BATCH_ACTIONS: BatchAction[] = [
  { id: 5, status: 'running', progress: 60 },
  { id: 4, status: 'completed' },
  { id: 3, status: 'aborted' },
  { id: 2, status: 'failed' },
];
