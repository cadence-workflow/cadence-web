import getHomeBadge from '../get-home-badge';

const getResponse = ({
  content,
  ...rest
}: { content: string } & Record<string, unknown>) => ({
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data: content,
    ...rest,
  },
  rejected: null,
});

describe(getHomeBadge.name, () => {
  it('returns the badge name', () => {
    expect(
      getHomeBadge(
        getResponse({
          content: '# Hi',
          title: 'Expense report 1',
          badgeName: 'Expense 1',
        })
      )
    ).toBe('Expense 1');
  });

  it('returns undefined without data', () => {
    expect(getHomeBadge(undefined)).toBeUndefined();
  });

  it('returns undefined when the page has only a title', () => {
    expect(
      getHomeBadge(getResponse({ content: '# Hi', title: 'Expense report 1' }))
    ).toBeUndefined();
  });

  it('returns undefined without a badge name', () => {
    expect(getHomeBadge(getResponse({ content: '# Hi' }))).toBeUndefined();
  });

  it('returns undefined for a rejected query', () => {
    expect(
      getHomeBadge({
        result: null,
        rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
      })
    ).toBeUndefined();
  });

  it('returns undefined when the result is not a home page', () => {
    expect(getHomeBadge({ result: { a: 1 }, rejected: null })).toBeUndefined();
  });
});
