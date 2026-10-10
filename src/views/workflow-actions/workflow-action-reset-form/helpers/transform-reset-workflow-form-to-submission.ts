import {
  type ResetWorkflowFormData,
  type ResetWorkflowSubmissionData,
} from '../workflow-action-reset-form.types';

export default function transformResetWorkflowFormToSubmission(
  formData: ResetWorkflowFormData
): ResetWorkflowSubmissionData {
  const decisionFinishEventId =
    formData.resetType === 'BinaryChecksum'
      ? formData.binaryChecksumFirstDecisionCompletedId
      : formData.decisionFinishEventId;

  return {
    // Omit an empty reason so that the reset API falls back to its default reason
    reason: formData.reason || undefined,
    decisionFinishEventId,
    skipSignalReapply: formData.skipSignalReapply,
  };
}
