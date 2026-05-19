export type BatchActionStatus = 'running' | 'completed' | 'aborted' | 'failed';

export type BatchActionType = 'cancel' | 'terminate' | 'reset' | 'signal';

export type BatchActionConfirmableType = Extract<
  BatchActionType,
  'cancel' | 'terminate' | 'signal'
>;

export type BatchActionModalConfig = {
  title: string;
  description: string;
  withForm: boolean;
  docsLink?: {
    text: string;
    href: string;
  };
};

export type BatchAction = {
  id: string;
  status: BatchActionStatus;
  progress?: number; // 0-100, only relevant when status is 'running'
  actionType: BatchActionType;
  startTime?: number;
  endTime?: number;
  rps?: number;
  concurrency?: number;
};
