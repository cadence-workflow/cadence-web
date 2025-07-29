import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowDiagnosticsMetadataPlaceholderText from '../workflow-diagnostics-metadata-placeholder-text';

describe(WorkflowDiagnosticsMetadataPlaceholderText.name, () => {
  it('renders the placeholder text correctly', () => {
    const placeholderText = 'No metadata available';

    render(
      <WorkflowDiagnosticsMetadataPlaceholderText
        placeholderText={placeholderText}
      />
    );

    expect(screen.getByText(placeholderText)).toBeInTheDocument();
  });
});
