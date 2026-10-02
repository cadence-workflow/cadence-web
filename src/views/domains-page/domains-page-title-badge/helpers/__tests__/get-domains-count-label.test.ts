import getDomainsCountLabel from '../get-domains-count-label';

describe(getDomainsCountLabel.name, () => {
  it.each`
    count | totalCount | hasNextPage | expected
    ${3}  | ${3}       | ${false}    | ${'3'}
    ${3}  | ${3}       | ${true}     | ${'3+'}
    ${1}  | ${3}       | ${false}    | ${'1 of 3'}
    ${1}  | ${3}       | ${true}     | ${'1 of 3+'}
    ${0}  | ${0}       | ${false}    | ${'0'}
  `(
    'returns "$expected" for count=$count, totalCount=$totalCount, hasNextPage=$hasNextPage',
    ({ count, totalCount, hasNextPage, expected }) => {
      expect(getDomainsCountLabel({ count, totalCount, hasNextPage })).toBe(
        expected
      );
    }
  );
});
