import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import getSearchAttributeValue from '../get-search-attribute-value';

describe(getSearchAttributeValue.name, () => {
  it('returns the decoded value for a base64-encoded JSON search attribute', () => {
    const row = getMockWorkflowListItem({
      searchAttributes: {
        MyField: { data: btoa('"hello"') },
      },
    });

    expect(getSearchAttributeValue(row, 'MyField')).toBe('hello');
  });

  it('returns null when the attribute is not present', () => {
    const row = getMockWorkflowListItem({ searchAttributes: {} });

    expect(getSearchAttributeValue(row, 'MissingField')).toBeNull();
  });

  it('returns null when searchAttributes is undefined', () => {
    const row = getMockWorkflowListItem({ searchAttributes: undefined });

    expect(getSearchAttributeValue(row, 'AnyField')).toBeNull();
  });

  it('returns a parsed number for a numeric payload', () => {
    const row = getMockWorkflowListItem({
      searchAttributes: {
        Count: { data: btoa('42') },
      },
    });

    expect(getSearchAttributeValue(row, 'Count')).toBe(42);
  });
});
