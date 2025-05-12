import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import SublistTable from '../sublist-table';
import { type SublistItem } from '../sublist-table.types';

const mockSublistItems: Array<SublistItem> = [
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
  {
    key: 'subKey3',
    label: 'Sub Key 3',
    value: (
      <div data-testid="mock-badge-container">
        <div data-testid="mock-badge">Active</div>
      </div>
    ),
  },
];

describe(SublistTable.name, () => {
  it('renders all sublist items correctly', () => {
    render(<SublistTable items={mockSublistItems} />);

    const sublistItems = screen.getAllByText(/Sub Key \d:/);
    expect(sublistItems).toHaveLength(3);

    expect(screen.getByText('Sub Key 1:')).toBeInTheDocument();
    expect(screen.getByText('mock-value-1')).toBeInTheDocument();

    expect(screen.getByText('Sub Key 2:')).toBeInTheDocument();
    expect(screen.getByText('mock-value-2')).toBeInTheDocument();

    expect(screen.getByText('Sub Key 3:')).toBeInTheDocument();
  });

  it('renders item with simple value correctly', () => {
    render(<SublistTable items={[mockSublistItems[0]]} />);

    const sublistItem = screen.getByText('Sub Key 1:').parentElement;
    if (!sublistItem) throw new Error('Sublist item not found');

    expect(within(sublistItem).getByText('Sub Key 1:')).toBeInTheDocument();
    expect(within(sublistItem).getByText('mock-value-1')).toBeInTheDocument();
  });

  it('renders item with complex value correctly', () => {
    render(<SublistTable items={[mockSublistItems[2]]} />);

    const sublistItem = screen.getByText('Sub Key 3:').parentElement;
    if (!sublistItem) throw new Error('Sublist item not found');

    expect(within(sublistItem).getByText('Sub Key 3:')).toBeInTheDocument();
    expect(
      within(sublistItem).getByTestId('mock-badge-container')
    ).toBeInTheDocument();
    expect(within(sublistItem).getByTestId('mock-badge')).toBeInTheDocument();
    expect(within(sublistItem).getByText('Active')).toBeInTheDocument();
  });
});
