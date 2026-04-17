import { type BatchAction } from './domain-batch-actions.types';

// TODO: Replace with real API data
export const MOCK_BATCH_ACTIONS: BatchAction[] = [
  {
    id: 5,
    status: 'running',
    progress: 60,
    actionType: 'cancel',
    startTime: Date.now() - 100000,
    rps: 200,
    concurrency: 10,
  },
  {
    id: 4,
    status: 'completed',
    actionType: 'terminate',
    startTime: Date.now() - 3600000,
    endTime: Date.now() - 1800000,
    rps: 150,
    concurrency: 5,
  },
  {
    id: 3,
    status: 'aborted',
    actionType: 'reset',
    startTime: Date.now() - 7200000,
    endTime: Date.now() - 5400000,
    rps: 100,
    concurrency: 8,
  },
  {
    id: 2,
    status: 'failed',
    actionType: 'signal',
    startTime: Date.now() - 14400000,
    endTime: Date.now() - 10800000,
    rps: 50,
    concurrency: 3,
  },
];
