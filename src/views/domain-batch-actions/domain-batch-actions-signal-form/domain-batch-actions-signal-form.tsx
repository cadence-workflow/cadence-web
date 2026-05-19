'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { signalWorkflowFormSchema } from '@/views/workflow-actions/workflow-action-signal-form/schemas/signal-workflow-form-schema';
import WorkflowActionSignalForm from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form';
import { type SignalWorkflowFormData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import { type BatchActionFormComponentProps } from '../domain-batch-actions.types';

export default function DomainBatchActionsSignalForm({
  formId,
  onSubmit,
}: BatchActionFormComponentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignalWorkflowFormData>({
    resolver: zodResolver(signalWorkflowFormSchema),
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <WorkflowActionSignalForm control={control} fieldErrors={errors} />
    </form>
  );
}
