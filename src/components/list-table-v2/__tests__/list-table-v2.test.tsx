import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

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
    description: 'Description for Key 3',
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
  it('renders all items correctly', () => {
    render(<ListTableV2 items={mockListTableV2ItemsConfig} />);

    // Test simple item with description
    const key1Row = screen.getByText('Key 1').parentElement?.parentElement;
    if (!key1Row) throw new Error('Key 1 row not found');
    expect(
      within(key1Row).getByText('Description for Key 1')
    ).toBeInTheDocument();
    expect(within(key1Row).getByText('mock-value')).toBeInTheDocument();

    // Test simple item with complex value
    const key2Row = screen.getByText('Key 2').parentElement?.parentElement;
    if (!key2Row) throw new Error('Key 2 row not found');
    expect(
      within(key2Row).getByText('Description for Key 2')
    ).toBeInTheDocument();
    expect(within(key2Row).getByTestId('mock-value-c1')).toBeInTheDocument();
    expect(within(key2Row).getByTestId('mock-value-c2')).toBeInTheDocument();

    // Test group item
    const key3Row = screen.getByText('Key 3').parentElement?.parentElement;
    if (!key3Row) throw new Error('Key 3 row not found');
    expect(
      within(key3Row).getByText('Description for Key 3')
    ).toBeInTheDocument();

    // Find the sublist container by looking for the first sub-item
    const sublist = screen.getByText('Sub Key 1:').parentElement?.parentElement;
    if (!sublist) throw new Error('Sublist container not found');

    // Find all sub-items within the container
    const sublistItems = within(sublist)
      .getAllByText(/Sub Key/)
      .map((label) => label.parentElement);
    expect(sublistItems).toHaveLength(2);

    // Test first sub-item
    const firstSubItem = sublistItems[0];
    if (!firstSubItem) throw new Error('First sub-item not found');
    expect(within(firstSubItem).getByText('Sub Key 1:')).toBeInTheDocument();
    expect(within(firstSubItem).getByText('mock-value-1')).toBeInTheDocument();

    // Test second sub-item
    const secondSubItem = sublistItems[1];
    if (!secondSubItem) throw new Error('Second sub-item not found');
    expect(within(secondSubItem).getByText('Sub Key 2:')).toBeInTheDocument();
    expect(within(secondSubItem).getByText('mock-value-2')).toBeInTheDocument();
  });
});
