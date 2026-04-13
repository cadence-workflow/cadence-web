export type BatchActionStatus = 'running' | 'completed' | 'aborted';

export type BatchAction = {
  id: number;
  status: BatchActionStatus;
  progress?: number; // 0-100, only relevant when status is 'running'
};
