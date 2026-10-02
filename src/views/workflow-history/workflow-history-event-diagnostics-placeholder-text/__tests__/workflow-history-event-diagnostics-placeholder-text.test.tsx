import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryEventDiagnosticsPlaceholderText from '../workflow-history-event-diagnostics-placeholder-text';

describe(WorkflowHistoryEventDiagnosticsPlaceholderText.name, () => {
  it('renders the placeholder text correctly', () => {
    const placeholderText = 'No metadata available';

    render(
      <WorkflowHistoryEventDiagnosticsPlaceholderText
        placeholderText={placeholderText}
      />
    );

    expect(screen.getByText(placeholderText)).toBeInTheDocument();
  });
});
