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
  it('returns the content, title and badge name', () => {
    expect(
      getHomePage(getResult('# Hi', { title: 'My page', badgeName: 'Badge' }))
    ).toEqual({ content: '# Hi', title: 'My page', badgeName: 'Badge' });
  });

  it('returns only the content when there is no title or badge name', () => {
    expect(getHomePage(getResult('# Hi'))).toEqual({ content: '# Hi' });
  });

  it('drops an invalid title and keeps the content and badge name', () => {
    expect(
      getHomePage(getResult('# Hi', { title: 5, badgeName: ' Badge ' }))
    ).toEqual({ content: '# Hi', badgeName: 'Badge' });
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
