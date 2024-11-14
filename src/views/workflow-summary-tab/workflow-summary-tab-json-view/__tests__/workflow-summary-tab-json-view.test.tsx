import React from 'react';

import { render, fireEvent, screen } from '@/test-utils/rtl';

import WorkflowSummaryTabJsonView from '../workflow-summary-tab-json-view';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock(
  '@/components/segmented-control-rounded/segmented-control-rounded',
  () =>
    jest.fn(({ onChange }) => (
      <div onClick={() => onChange({ activeKey: 'result' })}>
        SegmentedControlRounded Mock
      </div>
    ))
);
jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(() => <div>PrettyJson Mock</div>)
);
jest.mock('@/components/pretty-json-skeleton/pretty-json-skeleton', () =>
  jest.fn(() => <div>Mock JSON skeleton</div>)
);

describe('WorkflowSummaryTabJsonView Component', () => {
  const inputJson = { input: 'inputJson' };
  const resultJson = { result: 'resultJson' };

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
        isWorkflowRunning={false}
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
        isWorkflowRunning={false}
      />
    );

    // Mock the onChange event for SegmentedControlRounded
    const segmentedControl = screen.getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(segmentedControl).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
        isWorkflowRunning={true}
      />
    );

    // Mock the onChange event for SegmentedControlRounded
    const segmentedControl = screen.getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(getByText('Mock JSON skeleton')).toBeInTheDocument();
  });

  it('renders copy text button and pass the correct text', () => {
    const { getByText } = render(
      <WorkflowSummaryTabJsonView
        inputJson={inputJson}
        resultJson={resultJson}
        isWorkflowRunning={true}
      />
    );

    const copyButton = getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(JSON.stringify(inputJson, null, '\t'));
  });
});
