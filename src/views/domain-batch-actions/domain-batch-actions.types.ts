import { type FieldValues } from 'react-hook-form';

export type BatchActionStatus = 'running' | 'completed' | 'aborted' | 'failed';

export type BatchActionType = 'cancel' | 'terminate' | 'reset' | 'signal';

export type BatchActionConfirmableType = Extract<
  BatchActionType,
  'cancel' | 'terminate' | 'signal'
>;

export type BatchActionFormComponentProps = {
  formId: string;
  onSubmit: (data: FieldValues) => void;
};

type BatchActionModalBase = {
  title: string;
  description: string;
  docsLink?: {
    text: string;
    href: string;
  };
};

export type BatchActionModalConfig =
  | (BatchActionModalBase & { withForm: false })
  | (BatchActionModalBase & {
      withForm: true;
      FormComponent: React.ComponentType<BatchActionFormComponentProps>;
    });

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
