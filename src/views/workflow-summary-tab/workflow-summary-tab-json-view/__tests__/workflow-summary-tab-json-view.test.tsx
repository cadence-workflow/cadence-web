import React from 'react';

import copy from 'copy-to-clipboard';

import { render, fireEvent, screen, act } from '@/test-utils/rtl';

import WorkflowSummaryTabJsonView from '../workflow-summary-tab-json-view';

// Mock dependencies
jest.mock('copy-to-clipboard', jest.fn);
jest.mock(
  '@/components/segmented-control-rounded/segmented-control-rounded',
  () => jest.fn(() => <div>SegmentedControlRounded Mock</div>)
);
jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);

describe('WorkflowSummaryTabJsonView Component', () => {
  const inputJson = { input: 'inputJson' };
  const resultJson = { result: 'resultJson' };

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
      />
    );

    expect(getByText('SegmentedControlRounded Mock')).toBeInTheDocument();
    expect(getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('handles tab change', () => {
    render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
      />
    );

    // Mock the onChange event for SegmentedControlRounded
    const segmentedControl = screen.getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(segmentedControl).toBeInTheDocument();
  });

  it('copies JSON to clipboard', () => {
    render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
      />
    );

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    expect(copy).toHaveBeenCalledWith(JSON.stringify(inputJson, null, '\t'));
  });

  it('show tooltip for 1 second and remove it', () => {
    jest.useFakeTimers();

    render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
      />
    );

    const copyButton = screen.getByText('Copy');
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
