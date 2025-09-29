import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import getQueryResultContent from '../helpers/get-query-result-content';
import WorkflowQueriesResult from '../workflow-queries-result';
import { type QueryJsonContent } from '../workflow-queries-result.types';

jest.mock('../helpers/get-query-result-content');

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock('@/components/markdown/markdown', () =>
  jest.fn(({ markdown }) => <div>Markdown Mock: {markdown}</div>)
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => (
    <div>
      <div>PrettyJson Mock: {JSON.stringify(json)}</div>
    </div>
  ))
);

jest.mock('@/components/blocks/blocks', () =>
  jest.fn(({ blocks, domain, cluster, workflowId, runId }) => (
    <div>
      Blocks Mock: {domain}/{cluster}/{workflowId}/{runId} -{' '}
      {JSON.stringify(blocks)}
    </div>
  ))
);

describe(WorkflowQueriesResult.name, () => {
  it('renders json when the content type is json', () => {
    setup({
      content: {
        contentType: 'json',
        content: { test: 'dataJson' },
        isError: false,
      },
    });

    expect(
      screen.getByText(
        `PrettyJson Mock: ${JSON.stringify({ test: 'dataJson' })}`
      )
    ).toBeInTheDocument();
  });

  it('renders copy text button when the content type is json and pass the correct text', () => {
    setup({
      content: {
        contentType: 'json',
        content: { test: 'dataJson' },
        isError: false,
      },
    });

    const copyButton = screen.getByText(/Copy Button/);
    expect(copyButton).toBeInTheDocument();
    expect(copyButton.innerHTML).toMatch(
      JSON.stringify({ test: 'dataJson' }, null, '\t')
    );
  });

  it('renders markdown when the content type is markdown', () => {
    setup({
      content: {
        contentType: 'markdown',
        content: 'test-markdown',
        isError: false,
      },
    });

    expect(
      screen.getByText('Markdown Mock: test-markdown')
    ).toBeInTheDocument();
  });

  it('renders blocks when the content type is blocks', () => {
    setup({
      content: {
        contentType: 'blocks',
        content: [
          {
            type: 'section' as const,
            format: 'text/markdown',
            componentOptions: {
              text: '# Test',
            },
          },
        ],
        isError: false,
      },
    });

    expect(
      screen.getByText(
        /Blocks Mock: test-domain\/test-cluster\/test-workflow-id\/test-run-id/
      )
    ).toBeInTheDocument();
  });
});

function setup({
  data = { result: { test: 'dataJson' }, rejected: null },
  error = undefined,
  loading = false,
  content = {
    contentType: 'json',
    content: { test: 'dataJson' },
    isError: false,
  },
}: {
  data?: QueryWorkflowResponse;
  error?: any;
  loading?: boolean;
  content?: QueryJsonContent;
}) {
  (getQueryResultContent as jest.Mock).mockImplementation(() => content);
  render(
    <WorkflowQueriesResult
      data={data}
      error={error}
      loading={loading}
      domain="test-domain"
      cluster="test-cluster"
      workflowId="test-workflow-id"
      runId="test-run-id"
    />
  );
}
