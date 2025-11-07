import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryGroupedTable from '../workflow-history-grouped-table';

describe(WorkflowHistoryGroupedTable.name, () => {
  it('should render all column headers in correct order', () => {
    setup();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Event group')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should apply grid layout to table header', () => {
    setup();

    const header = screen.getByText('ID').parentElement;
    expect(header).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: '0.3fr 2fr 1fr 1.2fr 1fr 3fr minmax(0, 70px)',
    });
  });
});

function setup() {
  return render(<WorkflowHistoryGroupedTable />);
}
