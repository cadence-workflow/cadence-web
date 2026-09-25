import getDiagnosticsIssueExpansionId from '../get-diagnostics-issue-expansion-id';

describe(getDiagnosticsIssueExpansionId.name, () => {
  it('joins invariantType and issueId with a dot', () => {
    expect(
      getDiagnosticsIssueExpansionId({
        invariantType: 'Activity Failed',
        issueId: 3,
      })
    ).toBe('Activity Failed.3');
  });

  it('produces distinct ids for the same invariantType with different issueIds', () => {
    const first = getDiagnosticsIssueExpansionId({
      invariantType: 'Activity Failed',
      issueId: 0,
    });
    const second = getDiagnosticsIssueExpansionId({
      invariantType: 'Activity Failed',
      issueId: 1,
    });

    expect(first).not.toBe(second);
  });
});
