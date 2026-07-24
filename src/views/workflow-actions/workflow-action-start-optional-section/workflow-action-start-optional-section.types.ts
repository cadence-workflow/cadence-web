import { type SubFormProps } from '../workflow-action-start-form/workflow-action-start-form.types';

export type Props = Omit<SubFormProps, 'formData'> & {
  cluster: string;
  domain: string;
};
