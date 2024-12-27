import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import TableHeadCell from '../table-head-cell';
import { type Props } from '../table-head-cell.types';

describe(TableHeadCell.name, () => {
  // sortable test cases
  it('should not render as sorted when sort column does not match', async () => {
    setup({ isSortable: true, sortColumn: 'column_2', sortOrder: 'DESC' });

    expect(
      await screen.findByLabelText('Column 1, not sorted')
    ).toBeInTheDocument();
  });

  it('should call onSort when clicked when sort is enabled', async () => {
    const { mockOnSort, user } = setup({
      sortColumn: 'column_2',
      sortOrder: 'DESC',
      isSortable: true,
    });

    const cell = await screen.findByLabelText('Column 1, not sorted');

    await user.click(cell);
    expect(mockOnSort).toHaveBeenCalledWith('column_1');
  });

  it('should render sorted ASC without error', async () => {
    setup({ isSortable: true, sortColumn: 'column_1', sortOrder: 'ASC' });

    expect(
      await screen.findByLabelText('Column 1, ascending sorting')
    ).toBeInTheDocument();
  });

  it('should render sorted DESC without error', async () => {
    setup({ isSortable: true, sortColumn: 'column_1', sortOrder: 'DESC' });

    expect(
      await screen.findByLabelText('Column 1, descending sorting')
    ).toBeInTheDocument();
  });
  // unSortable test cases
  it('should not call onSort when clicked when sort is disabled', async () => {
    const { mockOnSort, user } = setup({
      sortColumn: 'column_2',
      sortOrder: 'DESC',
      isSortable: false,
    });

    const cell = await screen.findByLabelText('Column 1');

    await user.click(cell);
    expect(mockOnSort).not.toHaveBeenCalledWith('column_1');
  });

  it('should not render as sorted when sort is disabled', async () => {
    setup({ isSortable: false, sortColumn: 'column_1', sortOrder: 'ASC' });

    expect(await screen.findByLabelText('Column 1')).toBeInTheDocument();
  });
});

function setup({
  sortColumn,
  sortOrder,
  isSortable,
}: Pick<Props, 'sortColumn' | 'sortOrder' | 'isSortable'>) {
  const user = userEvent.setup();
  const mockOnSort = jest.fn();
  render(
    <TableHeadCell
      name="Column 1"
      columnID="column_1"
      width="20%"
      onSort={mockOnSort}
      sortColumn={sortColumn}
      sortOrder={sortOrder}
      isSortable={isSortable}
    />
  );
  return { mockOnSort, user };
}
