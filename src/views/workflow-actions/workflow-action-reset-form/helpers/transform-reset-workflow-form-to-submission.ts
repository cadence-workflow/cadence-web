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
    // Send undefined for an empty reason so the API applies its default reason
    reason: formData.reason || undefined,
    decisionFinishEventId,
    skipSignalReapply: formData.skipSignalReapply,
  };
}
