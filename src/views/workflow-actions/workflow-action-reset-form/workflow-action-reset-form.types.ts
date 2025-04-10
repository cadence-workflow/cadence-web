import { type z } from 'zod';

import type resetWorkflowRequestBodySchema from '@/route-handlers/reset-workflow/schemas/reset-workflow-request-body-schema';

import { type WorkflowActionFormProps } from '../workflow-actions.types';

import { type resetWorkflowFormSchema } from './schemas/reset-workflow-form-schema';

export type Props = WorkflowActionFormProps<ResetWorkflowFormData>;

export type ResetWorkflowFormData = z.infer<typeof resetWorkflowFormSchema>;

export type ResetWorkflowSubmissionData = z.infer<
  typeof resetWorkflowRequestBodySchema
>;
