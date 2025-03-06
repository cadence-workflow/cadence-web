import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge';
import {
  WORKFLOW_EVENT_STATUS,
  WORKFLOW_EVENT_STATUS_BADGE_SIZES,
} from '../workflow-history-event-status-badge.constants';

jest.mock('baseui/skeleton', () => ({
  Skeleton: jest.fn(() => <div>Loading Skeleton</div>),
}));

describe('WorkflowHistoryEventStatusBadge', () => {
  it('should show loading skeleton when status is not ready', () => {
    render(
      <WorkflowHistoryEventStatusBadge status="CANCELED" statusReady={false} />
    );

    expect(screen.getByText('Loading Skeleton')).toBeInTheDocument();
  });

  it('should match snapshot when status is not valid and badge should not be rendered', () => {
    const { container } = render(
      // @ts-expect-error invalid status
      <WorkflowHistoryEventStatusBadge status="INVALID_STATUS" statusReady />,
      { isSnapshotTest: true }
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when size is not valid and icon should not be rendered', () => {
    const { container } = render(
      <WorkflowHistoryEventStatusBadge
        // @ts-expect-error invalid status
        status="COMPLETE"
        statusReady
        // @ts-expect-error invalid size
        size="invalid"
      />
    );
    expect(container).toMatchSnapshot();
  });
  // snapshot tests for possible combinations of status and size
  for (const status of Object.values(WORKFLOW_EVENT_STATUS)) {
    for (const size of Object.values(WORKFLOW_EVENT_STATUS_BADGE_SIZES)) {
      it(`should match snapshot when status is ${status} and size is ${size}`, () => {
        const { container } = render(
          <WorkflowHistoryEventStatusBadge
            status={status}
            statusReady
            size={size}
          />,
          { isSnapshotTest: true }
        );
        expect(container).toMatchSnapshot();
      });
    }
  }
});
