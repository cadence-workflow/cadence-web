import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import ReadOnlyDetailsTable from '../read-only-details-table';
import { type Props } from '../read-only-details-table.types';

describe(ReadOnlyDetailsTable.name, () => {
  it('renders string and react node values', () => {
    setup({
      rows: [
        { label: 'Name', value: 'Daily schedule' },
        { label: 'Status', value: <span>Running</span> },
      ],
    });

    expect(screen.getByRole('table', { name: 'Details table' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByText('Daily schedule')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('omits rows marked as hidden', () => {
    setup({
      rows: [
        { label: 'Visible row', value: 'value' },
        { label: 'Hidden row', value: 'secret', hide: true },
      ],
    });

    expect(screen.getByText('Visible row')).toBeInTheDocument();
    expect(screen.queryByText('Hidden row')).not.toBeInTheDocument();
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('renders fallback for null and empty string values', () => {
    setup({
      rows: [
        { label: 'Null value', value: null },
        { label: 'Empty value', value: '' },
      ],
      emptyValue: 'N/A',
    });

    expect(screen.getByText('Null value')).toBeInTheDocument();
    expect(screen.getByText('Empty value')).toBeInTheDocument();
    expect(screen.getAllByText('N/A')).toHaveLength(2);
  });
});

function setup(props: Props) {
  render(<ReadOnlyDetailsTable {...props} />);
}
