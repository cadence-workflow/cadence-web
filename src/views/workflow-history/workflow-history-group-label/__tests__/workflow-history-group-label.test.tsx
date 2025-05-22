import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryGroupLabel from '../workflow-history-group-label';

describe('WorkflowHistoryGroupLabel', () => {
  it('renders just the label when fullName is not provided', () => {
    render(
      <WorkflowHistoryGroupLabel label="Activity 0: activity.cron.Start" />
    );
    expect(
      screen.getByText('Activity 0: activity.cron.Start')
    ).toBeInTheDocument();
  });

  it('renders label with tooltip when fullName is provided', async () => {
    const user = userEvent.setup();

    render(
      <WorkflowHistoryGroupLabel
        label="Activity 0: Start"
        fullName="activity.cron.Start"
      />
    );

    const label = await screen.findByText('Activity 0: Start');
    expect(label).toBeInTheDocument();

    await user.hover(label);

    expect(await screen.findByText('activity.cron.Start')).toBeInTheDocument();
  });
});
