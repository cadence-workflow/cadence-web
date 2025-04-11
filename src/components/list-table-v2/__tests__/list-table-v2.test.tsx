import React from 'react';

import { render } from '@/test-utils/rtl';

import ListTableV2 from '../list-table-v2';
import { type ListTableV2Item } from '../list-table-v2.types';

const mockListTableV2ItemsConfig: Array<ListTableV2Item> = [
  {
    key: 'key1',
    label: 'Key 1',
    description: 'Description for Key 1',
    kind: 'simple',
    value: 'mock-value',
  },
  {
    key: 'key2',
    label: 'Key 2',
    description: 'Description for Key 2',
    kind: 'simple',
    value: (
      <div>
        {['mock-value-c1', 'mock-value-c2'].map((val) => (
          <div key={val} data-testid={val} />
        ))}
      </div>
    ),
  },
  {
    key: 'key3',
    label: 'Key 3',
    kind: 'group',
    items: [
      {
        key: 'subKey1',
        label: 'Sub Key 1',
        value: 'mock-value-1',
      },
      {
        key: 'subKey2',
        label: 'Sub Key 2',
        value: 'mock-value-2',
      },
    ],
  },
];

describe(ListTableV2.name, () => {
  it('renders correctly', () => {
    const { container } = render(
      <ListTableV2 items={mockListTableV2ItemsConfig} />
    );

    expect(container).toMatchSnapshot();
  });
});
