import React from 'react';

import copy from 'copy-to-clipboard';

import { render, fireEvent, screen, act } from '@/test-utils/rtl';

import WorkflowSummaryTabJsonView from '../workflow-history-event-details-json';

// Mock dependencies
jest.mock('copy-to-clipboard', jest.fn);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);

describe('WorkflowSummaryTabJsonView Component', () => {
  const inputJson = { input: 'inputJson' };

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView entryValue={inputJson} />
    );

    expect(getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('copies JSON to clipboard', () => {
    render(<WorkflowSummaryTabJsonView entryValue={inputJson} />);

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);

    expect(copy).toHaveBeenCalledWith(JSON.stringify(inputJson, null, '\t'));
  });

  it('show tooltip for 1 second and remove it', () => {
    jest.useFakeTimers();

    render(<WorkflowSummaryTabJsonView entryValue={inputJson} />);

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);
    const visibleTooltip = screen.getByText('Copied');
    expect(visibleTooltip).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 + 500); //hide + animation duration
    });

    // Ensure the tooltip is hidden after 1000ms
    const hiddenTooltip = screen.queryByText('Copied');
    expect(hiddenTooltip).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
