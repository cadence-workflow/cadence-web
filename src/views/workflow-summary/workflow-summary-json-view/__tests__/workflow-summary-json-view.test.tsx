import React from 'react';

import { render, fireEvent, screen } from '@/test-utils/rtl';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import WorkflowSummaryJsonView from '../workflow-summary-json-view';
import { type Props } from '../workflow-summary-json-view.types';

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

describe('WorkflowSummaryJsonView Component', () => {
  it('renders correctly with initial props', () => {
    const { getByText } = setup({});

    expect(getByText('SegmentedControlRounded Mock')).toBeInTheDocument();
    expect(getByText('PrettyJson Mock')).toBeInTheDocument();
  });

  it('handles tab change', () => {
    setup({});

    // Mock the onChange event for SegmentedControlRounded
    const segmentedControl = screen.getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(segmentedControl).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    const { getByText } = setup({ isWorkflowRunning: true });

    // Mock the onChange event for SegmentedControlRounded
    const segmentedControl = screen.getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(getByText('Mock JSON skeleton')).toBeInTheDocument();
  });

  it('renders copy text button and pass the correct text', () => {
    const { getByText } = setup({ isWorkflowRunning: true });
    const copyButton = getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(losslessInputJson, null, '\t')
    );
  });

  it('renders archived result correctly', () => {
    const { getByText, getByRole } = setup({ isArchived: true });
    const segmentedControl = getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(
      getByText('Workflow is archived, result is only available in')
    ).toBeInTheDocument();
    expect(getByRole('link', { name: 'history' })).toBeInTheDocument();
  });

  it('should not render loading skeleton when isArchived is true and isWorkflowRunning is true', () => {
    const { queryByText, getByText } = setup({
      isArchived: true,
      isWorkflowRunning: true,
    });
    const segmentedControl = getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(queryByText('Mock JSON skeleton')).not.toBeInTheDocument();
    expect(
      queryByText('Workflow is archived, result is only available in')
    ).toBeInTheDocument();
  });

  it('should not render result when isArchived is true and isWorkflowRunning is false', () => {
    const { queryByText, getByText } = setup({
      isArchived: true,
      isWorkflowRunning: false,
    });
    const segmentedControl = getByText('SegmentedControlRounded Mock');
    fireEvent.click(segmentedControl);
    expect(queryByText('PrettyJson Mock')).not.toBeInTheDocument();
    expect(
      queryByText('Workflow is archived, result is only available in')
    ).toBeInTheDocument();
  });

  it('should default to input tab when defaultTab is not provided', () => {
    const { getByText } = setup({});
    // With the mocked copy button, we can check if the text contains input data
    const copyButton = getByText(/Copy Button/);
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(losslessInputJson, null, '\t')
    );
  });

  it('should initialize with input tab when defaultTab is "input"', () => {
    const { getByText } = setup({ defaultTab: 'input' });
    const copyButton = getByText(/Copy Button/);
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(losslessInputJson, null, '\t')
    );
  });

  it('should initialize with result tab when defaultTab is "result"', () => {
    const { getByText } = setup({ defaultTab: 'result' });
    const copyButton = getByText(/Copy Button/);
    expect(copyButton.innerHTML).toMatch(
      losslessJsonStringify(losselessResultJson, null, '\t')
    );
  });

  it('should hide segmented control and show static title when hideTabToggle is true with input tab', () => {
    const { queryByText, getByText } = setup({
      hideTabToggle: true,
      defaultTab: 'input',
    });
    expect(queryByText('SegmentedControlRounded Mock')).not.toBeInTheDocument();
    expect(getByText('Input')).toBeInTheDocument();
  });

  it('should hide segmented control and show static title when hideTabToggle is true with result tab', () => {
    const { queryByText, getByText } = setup({
      hideTabToggle: true,
      defaultTab: 'result',
    });
    expect(queryByText('SegmentedControlRounded Mock')).not.toBeInTheDocument();
    expect(getByText('Result')).toBeInTheDocument();
  });
});

const losslessInputJson = {
  input: 'inputJson',
  long: BigInt('12345678901234567890'),
};
const losselessResultJson = {
  result: 'resultJson',
  long: BigInt('12345678901234567891'),
};

const setup = ({
  inputJson = losslessInputJson,
  resultJson = losselessResultJson,
  isWorkflowRunning = false,
  isArchived = false,
  defaultTab,
  hideTabToggle = false,
}: Partial<Props>) => {
  return render(
    <WorkflowSummaryJsonView
      inputJson={inputJson}
      resultJson={resultJson}
      isWorkflowRunning={isWorkflowRunning}
      isArchived={isArchived}
      defaultTab={defaultTab}
      hideTabToggle={hideTabToggle}
      domain="test-domain"
      cluster="test-cluster"
      runId="test-run-id"
      workflowId="test-workflow-id"
    />
  );
};
