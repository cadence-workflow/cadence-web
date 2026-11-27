import { resetWorkflowFormSchema } from '../reset-workflow-form-schema';

describe('resetWorkflowFormSchema', () => {
  it('accepts an empty reason', () => {
    const result = resetWorkflowFormSchema.safeParse({
      resetType: 'EventId',
      decisionFinishEventId: '4',
      reason: '',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a missing reason', () => {
    const result = resetWorkflowFormSchema.safeParse({
      resetType: 'BinaryChecksum',
      binaryChecksumFirstDecisionCompletedId: '7',
    });

    expect(result.success).toBe(true);
  });

  it('requires decisionFinishEventId when resetType is EventId', () => {
    const result = resetWorkflowFormSchema.safeParse({
      resetType: 'EventId',
      decisionFinishEventId: '',
      reason: 'Test reason',
    });

    expect(result.success).toBe(false);
  });
});
