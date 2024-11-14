import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import WorkflowQueriesResultJson from '../workflow-queries-result-json';

jest.mock('../helpers/get-query-json-content', () => ({
  __esModule: true,
  default: jest.fn(({ data }) => ({ content: data.result, isError: false })),
}));

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => (
    <div>
      <div>PrettyJson Mock: {JSON.stringify(json)}</div>
    </div>
  ))
);

describe(WorkflowQueriesResultJson.name, () => {
  it('renders correctly with initial props', () => {
    setup({});

    expect(
      screen.getByText(
        `PrettyJson Mock: ${JSON.stringify({ test: 'dataJson' })}`
      )
    ).toBeInTheDocument();
  });

  it('renders copy text button and pass the correct text', () => {
    setup({});

    const copyButton = screen.getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      JSON.stringify({ test: 'dataJson' }, null, '\t')
    );
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
