import { type z } from 'zod';

import type startWorkflowRequestBodySchema from '@/route-handlers/start-workflow/schemas/start-workflow-request-body-schema';

import { type WorkflowActionFormProps } from '../workflow-actions.types';

import { type startWorkflowFormSchema } from './schemas/start-workflow-form-schema';

export type Props = WorkflowActionFormProps<StartWorkflowFormData>;

export type SubFormProps = Pick<
  Props,
  'control' | 'clearErrors' | 'formData'
> & {
  getErrorMessage: (field: string) => string | undefined;
};

export type StartWorkflowFormData = z.infer<typeof startWorkflowFormSchema>;

export type StartWorkflowSubmissionData = z.infer<
  typeof startWorkflowRequestBodySchema
>;
