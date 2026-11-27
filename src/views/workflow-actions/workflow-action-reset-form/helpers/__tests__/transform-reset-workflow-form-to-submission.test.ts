import { type ResetWorkflowFormData } from '../../workflow-action-reset-form.types';
import transformResetWorkflowFormToSubmission from '../transform-reset-workflow-form-to-submission';

describe(transformResetWorkflowFormToSubmission.name, () => {
  it('uses decisionFinishEventId when resetType is EventId', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'EventId',
      decisionFinishEventId: '4',
      reason: 'Test reason',
      skipSignalReapply: true,
    };

    expect(transformResetWorkflowFormToSubmission(formData)).toEqual({
      reason: 'Test reason',
      decisionFinishEventId: '4',
      skipSignalReapply: true,
    });
  });

  it('uses binaryChecksumFirstDecisionCompletedId when resetType is BinaryChecksum', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'BinaryChecksum',
      binaryChecksumFirstDecisionCompletedId: '7',
      reason: 'Test reason',
      skipSignalReapply: false,
    };

    expect(transformResetWorkflowFormToSubmission(formData)).toEqual({
      reason: 'Test reason',
      decisionFinishEventId: '7',
      skipSignalReapply: false,
    });
  });

  it('omits the reason when it is empty so that the default reason is used', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'EventId',
      decisionFinishEventId: '4',
      reason: '',
      skipSignalReapply: false,
    };

    expect(
      transformResetWorkflowFormToSubmission(formData).reason
    ).toBeUndefined();
  });
});
