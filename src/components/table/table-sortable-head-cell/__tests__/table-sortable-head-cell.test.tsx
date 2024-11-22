import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type SortOrder } from '@/utils/sort-by';

import TableSortableHeadCell from '../table-sortable-head-cell';

describe(TableSortableHeadCell.name, () => {
  it('should render unsorted without error', async () => {
    setup({ sortColumn: 'column_2', sortOrder: 'DESC' });

    expect(
      await screen.findByLabelText('Column 1, not sorted')
    ).toBeInTheDocument();
  });

  it('should call onSort when clicked', async () => {
    const { mockOnSort, user } = setup({
      sortColumn: 'column_2',
      sortOrder: 'DESC',
    });

    const cell = await screen.findByLabelText('Column 1, not sorted');

    await user.click(cell);
    expect(mockOnSort).toHaveBeenCalledWith('column_1');
  });

  it('should render sorted ASC without error', async () => {
    setup({ sortColumn: 'column_1', sortOrder: 'ASC' });

    expect(
      await screen.findByLabelText('Column 1, ascending sorting')
    ).toBeInTheDocument();
  });

  it('should render sorted DESC without error', async () => {
    setup({ sortColumn: 'column_1', sortOrder: 'DESC' });

    expect(
      await screen.findByLabelText('Column 1, descending sorting')
    ).toBeInTheDocument();
  });
});

function setup({
  sortColumn,
  sortOrder,
}: {
  sortColumn: string;
  sortOrder: SortOrder;
}) {
  const user = userEvent.setup();
  const mockOnSort = jest.fn();
  render(
    <TableSortableHeadCell
      name="Column 1"
      columnID="column_1"
      width="20%"
      onSort={mockOnSort}
      sortColumn={sortColumn}
      sortOrder={sortOrder}
    />
  );
  return { mockOnSort, user };
}
