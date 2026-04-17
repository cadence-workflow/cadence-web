export type BatchActionStatus = 'running' | 'completed' | 'aborted' | 'failed';

export type BatchActionType = 'cancel' | 'terminate' | 'reset' | 'signal';

export type BatchAction = {
  id: number;
  status: BatchActionStatus;
  progress?: number; // 0-100, only relevant when status is 'running'
  actionType?: BatchActionType;
  startTime?: number;
  endTime?: number;
  rps?: number;
  concurrency?: number;
};
