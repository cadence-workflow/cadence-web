export type BatchActionStatus = 'running' | 'completed' | 'aborted' | 'failed';

export type BatchAction = {
  id: number;
  status: BatchActionStatus;
  progress?: number; // 0-100, only relevant when status is 'running'
};
