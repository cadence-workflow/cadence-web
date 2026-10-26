import { render, screen } from '@/test-utils/rtl';

import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

import MarkdocWorkflowInput from '../markdoc-workflow-input';
import MarkdocWorkflowPayload from '../markdoc-workflow-payload';
import { type TagProps } from '../markdoc-workflow-payload.types';
import MarkdocWorkflowResult from '../markdoc-workflow-result';
import MarkdocWorkflowSearchAttributes from '../markdoc-workflow-search-attributes';

jest.mock('../markdoc-workflow-payload-content', () =>
  jest.fn(({ kind, path, name, domain, cluster, workflowId, runId }) => (
    <div>
      Mock content: {kind} {path ?? name ?? 'no-path'} {domain} {cluster}{' '}
      {workflowId} {runId}
    </div>
  ))
);

const context = { domain: 'd', cluster: 'c', workflowId: 'w', runId: 'r' };

describe(MarkdocWorkflowPayload.name, () => {
  it('inherits workflow details from the markdown context', () => {
    setup({ Component: MarkdocWorkflowInput, props: {}, ctx: context });
    expect(
      screen.getByText('Mock content: input no-path d c w r')
    ).toBeInTheDocument();
  });

  it('result wrapper renders the result kind with a path', () => {
    setup({
      Component: MarkdocWorkflowResult,
      props: { path: 'a.b' },
      ctx: context,
    });
    expect(
      screen.getByText('Mock content: result a.b d c w r')
    ).toBeInTheDocument();
  });

  it('search attributes wrapper passes the name', () => {
    setup({
      Component: MarkdocWorkflowSearchAttributes,
      props: { name: 'CustomKeywordField' },
      ctx: context,
    });
    expect(
      screen.getByText(
        'Mock content: searchAttributes CustomKeywordField d c w r'
      )
    ).toBeInTheDocument();
  });

  it('uses explicit workflowId and runId', () => {
    setup({
      Component: MarkdocWorkflowResult,
      props: { workflowId: 'other', runId: 'run-2' },
      ctx: context,
    });
    expect(
      screen.getByText('Mock content: result no-path d c other run-2')
    ).toBeInTheDocument();
  });

  it('does not inherit the context runId for an explicit workflowId', () => {
    setup({
      Component: MarkdocWorkflowResult,
      props: { workflowId: 'other' },
      ctx: context,
    });
    expect(
      screen.getByText('A runId is required when workflowId is set')
    ).toBeInTheDocument();
  });

  it('shows a message when the workflow context is missing', () => {
    setup({ Component: MarkdocWorkflowInput, props: {}, ctx: {} });
    expect(
      screen.getByText(/needs a domain, cluster and workflowId/)
    ).toBeInTheDocument();
  });
});

function setup({
  Component,
  props,
  ctx,
}: {
  Component: (props: TagProps & { name?: string }) => JSX.Element;
  props: TagProps & { name?: string };
  ctx: Record<string, string>;
}) {
  render(
    <MarkdownContext.Provider value={ctx}>
      <Component {...props} />
    </MarkdownContext.Provider>
  );
}
