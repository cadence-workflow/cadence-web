import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge';
import {
  WORKFLOW_EVENT_STATUS,
  WORKFLOW_EVENT_STATUS_BADGE_SIZES,
} from '../workflow-history-event-status-badge.constants';

describe('WorkflowHistoryEventStatusBadge', () => {
  it('should match snapshot when status is not valid and badge should not be rendered', () => {
    const { container } = render(
      // @ts-expect-error invalid status
      <WorkflowHistoryEventStatusBadge status="INVALID_STATUS" />,
      { isSnapshotTest: true }
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when size is not valid and icon should not be rendered', () => {
    const { container } = render(
      // @ts-expect-error invalid size
      <WorkflowHistoryEventStatusBadge status="COMPLETE" size="invalid" />
    );
    expect(container).toMatchSnapshot();
  });
  // snapshot tests for possible combinations of status and size
  for (const status of Object.values(WORKFLOW_EVENT_STATUS)) {
    for (const size of Object.values(WORKFLOW_EVENT_STATUS_BADGE_SIZES)) {
      it(`should match snapshot when status is ${status} and size is ${size}`, () => {
        const { container } = render(
          <WorkflowHistoryEventStatusBadge status={status} size={size} />,
          { isSnapshotTest: true }
        );
        expect(container).toMatchSnapshot();
      });
    }
  }
});
