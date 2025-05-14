import { type z } from 'zod';

import type signalWorkflowRequestBodySchema from '@/route-handlers/signal-workflow/schemas/signal-workflow-request-body-schema';

import { type WorkflowActionFormProps } from '../workflow-actions.types';

import { type signalWorkflowFormSchema } from './schemas/signal-workflow-form-schema';

export type SignalWorkflowFormData = z.infer<typeof signalWorkflowFormSchema>;

export type Props = WorkflowActionFormProps<SignalWorkflowFormData>;

export type SignalWorkflowSubmissionData = z.infer<
  typeof signalWorkflowRequestBodySchema
>;
