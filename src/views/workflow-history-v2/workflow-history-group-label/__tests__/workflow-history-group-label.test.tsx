import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryGroupLabel from '../workflow-history-group-label';

describe('WorkflowHistoryGroupLabel', () => {
  it('renders just the label when shortLabel is not provided', () => {
    render(
      <WorkflowHistoryGroupLabel label="Activity 0: activity.cron.Start" />
    );
    expect(
      screen.getByText('Activity 0: activity.cron.Start')
    ).toBeInTheDocument();
  });

  it('renders shortLabel with tooltip containing full label when shortLabel is provided', async () => {
    const user = userEvent.setup();

    render(
      <WorkflowHistoryGroupLabel
        label="Activity 0: activity.cron.Start"
        shortLabel="Activity 0: Start"
      />
    );

    const label = await screen.findByText('Activity 0: Start');
    expect(label).toBeInTheDocument();

    await user.hover(label);

    expect(
      await screen.findByText('Activity 0: activity.cron.Start')
    ).toBeInTheDocument();
  });
});
