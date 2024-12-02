import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventDetailsPlaceholderText from '../workflow-history-event-details-placeholder-text';

describe('WorkflowHistoryEventDetailsPlaceholderText', () => {
  it('renders not set by default', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsPlaceholderText />
    );

    expect(getByText('Not set')).toBeInTheDocument();
  });

  it('renders passed placeholder text', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsPlaceholderText placeholderText="placeholder test" />
    );

    expect(getByText('placeholder test')).toBeInTheDocument();
  });
});
