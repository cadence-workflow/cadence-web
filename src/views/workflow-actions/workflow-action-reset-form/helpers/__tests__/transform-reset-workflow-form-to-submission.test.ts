import { resetWorkflowFormSchema } from '../../schemas/reset-workflow-form-schema';
import { type ResetWorkflowFormData } from '../../workflow-action-reset-form.types';
import transformResetWorkflowFormToSubmission from '../transform-reset-workflow-form-to-submission';

describe('transformResetWorkflowFormToSubmission', () => {
  it('should use the event ID when resetType is EventId', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'EventId',
      decisionFinishEventId: '4',
      reason: 'Test reason',
      skipSignalReapply: true,
    };

    const result = transformResetWorkflowFormToSubmission(formData);

    expect(result).toEqual({
      reason: 'Test reason',
      decisionFinishEventId: '4',
      skipSignalReapply: true,
    });
  });

  it('should use the first decision completed ID when resetType is BinaryChecksum', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'BinaryChecksum',
      binaryChecksumFirstDecisionCompletedId: '7',
      reason: 'Test reason',
      skipSignalReapply: false,
    };

    const result = transformResetWorkflowFormToSubmission(formData);

    expect(result).toEqual({
      reason: 'Test reason',
      decisionFinishEventId: '7',
      skipSignalReapply: false,
    });
  });

  it('should omit the reason when it is not provided', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'EventId',
      decisionFinishEventId: '4',
    };

    const result = transformResetWorkflowFormToSubmission(formData);

    expect(result.reason).toBeUndefined();
  });

  it('should omit the reason when it is empty', () => {
    const formData: ResetWorkflowFormData = {
      resetType: 'EventId',
      decisionFinishEventId: '4',
      reason: '',
    };

    const result = transformResetWorkflowFormToSubmission(formData);

    expect(result.reason).toBeUndefined();
  });

  it('should omit a whitespace-only reason once parsed by the form schema', () => {
    const formData = resetWorkflowFormSchema.parse({
      resetType: 'EventId',
      decisionFinishEventId: '4',
      reason: '   ',
    });

    const result = transformResetWorkflowFormToSubmission(formData);

    expect(result.reason).toBeUndefined();
  });
});
