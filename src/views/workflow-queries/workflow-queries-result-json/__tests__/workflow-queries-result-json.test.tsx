import React from 'react';

import copy from 'copy-to-clipboard';
import { act } from 'react-dom/test-utils';

import { render, fireEvent, screen } from '@/test-utils/rtl';

import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import WorkflowQueriesResultJson from '../workflow-queries-result-json';

jest.mock('copy-to-clipboard', jest.fn);

jest.mock('../helpers/get-query-json-content', () => ({
  __esModule: true,
  default: jest.fn(({ data }) => ({ content: data.result, isError: false })),
}));

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => (
    <div>
      <div>PrettyJson Mock</div>
      <div>{JSON.stringify(json)}</div>
    </div>
  ))
);

describe(WorkflowQueriesResultJson.name, () => {
  it('renders correctly with initial props', () => {
    setup({});

    expect(screen.getByText('PrettyJson Mock')).toBeInTheDocument();
    expect(screen.getByText(/dataJson/)).toBeInTheDocument();
  });

  it('copies JSON to clipboard', () => {
    const testData = { test: 'dataJson' };
    setup({ data: { result: testData, rejected: null } });

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);

    expect(copy).toHaveBeenCalledWith(JSON.stringify(testData, null, '\t'));
  });

  it('show tooltip for 1 second and remove it', () => {
    jest.useFakeTimers();

    setup({});

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);
    const visibleTooltip = screen.getByText('Copied');
    expect(visibleTooltip).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 + 500); // hide + animation duration
    });

    // Ensure the tooltip is hidden after 1000ms
    const hiddenTooltip = screen.queryByText('Copied');
    expect(hiddenTooltip).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});

function setup({
  data = { result: { test: 'dataJson' }, rejected: null },
  error = undefined,
  loading = false,
}: {
  data?: QueryWorkflowResponse;
  error?: any;
  loading?: boolean;
}) {
  render(
    <WorkflowQueriesResultJson data={data} error={error} loading={loading} />
  );
}
