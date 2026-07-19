import { isValidElement } from 'react';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import scheduleRunsTableConfig from '../schedule-runs-table.config';

describe('scheduleRunsTableConfig', () => {
  it('builds an absolute workflow link from row domain and cluster', () => {
    const [{ renderCell: renderRunIdCell }] = scheduleRunsTableConfig.filter(
      (column) => column.id === 'RunID'
    );

    const cell = renderRunIdCell({
      ...getMockWorkflowListItem({
        workflowID: 'workflow/id',
        runID: 'run/id?',
      }),
      domain: 'test-domain',
      cluster: 'test-cluster',
    });

    expect(isValidElement(cell)).toBe(true);
    if (!isValidElement(cell)) {
      return;
    }

    expect(cell.props).toEqual(
      expect.objectContaining({
        href: '/domains/test-domain/test-cluster/workflows/workflow%2Fid/run%2Fid%3F',
        children: 'run/id?',
      })
    );
  });
});
