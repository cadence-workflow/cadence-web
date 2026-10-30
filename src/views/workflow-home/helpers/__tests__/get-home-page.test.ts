import getHomePage from '../get-home-page';

const getResult = (
  data: unknown,
  extra: Record<string, unknown> = {},
  format = 'text/markdown'
) => ({
  cadenceResponseType: 'formattedData',
  format,
  data,
  ...extra,
});

describe(getHomePage.name, () => {
  it('returns the content and title', () => {
    expect(getHomePage(getResult('# Hi', { title: 'My page' }))).toEqual({
      content: '# Hi',
      title: 'My page',
    });
  });

  it('returns only the content when there is no title', () => {
    expect(getHomePage(getResult('# Hi'))).toEqual({ content: '# Hi' });
  });

  it('drops an invalid title and keeps the content', () => {
    expect(getHomePage(getResult('# Hi', { title: 5 }))).toEqual({
      content: '# Hi',
    });
  });

  it('returns undefined for another format', () => {
    expect(getHomePage(getResult('# Hi', {}, 'text/plain'))).toBeUndefined();
  });

  it('returns undefined when the data is not a string', () => {
    expect(getHomePage(getResult({ content: '# Hi' }))).toBeUndefined();
  });

  it('returns undefined for null', () => {
    expect(getHomePage(null)).toBeUndefined();
  });
});
