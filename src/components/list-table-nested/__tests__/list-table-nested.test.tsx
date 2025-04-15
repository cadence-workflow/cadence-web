import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import ListTableNested from '../list-table-nested';
import { type ListTableNestedItem } from '../list-table-nested.types';

const mockListTableNestedItemsConfig: Array<ListTableNestedItem> = [
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

describe(ListTableNested.name, () => {
  it('renders simple items with description correctly', () => {
    render(<ListTableNested items={[mockListTableNestedItemsConfig[0]]} />);

    const key1Row = screen.getByText('Key 1').parentElement?.parentElement;
    if (!key1Row) throw new Error('Key 1 row not found');

    expect(
      within(key1Row).getByText('Description for Key 1')
    ).toBeInTheDocument();
    expect(within(key1Row).getByText('mock-value')).toBeInTheDocument();
  });

  it('renders simple items with complex values correctly', () => {
    render(<ListTableNested items={[mockListTableNestedItemsConfig[1]]} />);

    const key2Row = screen.getByText('Key 2').parentElement?.parentElement;
    if (!key2Row) throw new Error('Key 2 row not found');

    expect(
      within(key2Row).getByText('Description for Key 2')
    ).toBeInTheDocument();
    expect(within(key2Row).getByTestId('mock-value-c1')).toBeInTheDocument();
    expect(within(key2Row).getByTestId('mock-value-c2')).toBeInTheDocument();
  });

  it('renders group items with sub-items correctly', () => {
    render(<ListTableNested items={[mockListTableNestedItemsConfig[2]]} />);

    const key3Row = screen.getByText('Key 3').parentElement?.parentElement;
    if (!key3Row) throw new Error('Key 3 row not found');
    expect(
      within(key3Row).getByText('Description for Key 3')
    ).toBeInTheDocument();

    const sublist = screen.getByText('Sub Key 1:').parentElement?.parentElement;
    if (!sublist) throw new Error('Sublist container not found');

    const sublistItems = within(sublist)
      .getAllByText(/Sub Key/)
      .map((label) => label.parentElement);
    expect(sublistItems).toHaveLength(2);

    const firstSubItem = sublistItems[0];
    if (!firstSubItem) throw new Error('First sub-item not found');
    expect(within(firstSubItem).getByText('Sub Key 1:')).toBeInTheDocument();
    expect(within(firstSubItem).getByText('mock-value-1')).toBeInTheDocument();

    const secondSubItem = sublistItems[1];
    if (!secondSubItem) throw new Error('Second sub-item not found');
    expect(within(secondSubItem).getByText('Sub Key 2:')).toBeInTheDocument();
    expect(within(secondSubItem).getByText('mock-value-2')).toBeInTheDocument();
  });
});
