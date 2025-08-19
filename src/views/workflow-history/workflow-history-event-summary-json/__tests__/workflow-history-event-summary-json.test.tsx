import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventSummaryJson from '../workflow-history-event-summary-json';

describe(WorkflowHistoryEventSummaryJson.name, () => {
  const inputJson = {
    input: 'inputJson',
  };

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <WorkflowHistoryEventSummaryJson value={inputJson} />
    );

    expect(getByText(/{"input":"inputJson"}/)).toBeInTheDocument();
  });
});
