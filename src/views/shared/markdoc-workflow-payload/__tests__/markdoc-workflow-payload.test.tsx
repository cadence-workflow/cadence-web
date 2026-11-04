import { render, screen } from '@/test-utils/rtl';

import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

import MarkdocWorkflowPayload from '../markdoc-workflow-payload';
import { type Props } from '../markdoc-workflow-payload.types';

jest.mock(
  '../markdoc-workflow-payload-content/markdoc-workflow-payload-content',
  () =>
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
    setup({ props: { kind: 'input' }, ctx: context });
    expect(
      screen.getByText('Mock content: input no-path d c w r')
    ).toBeInTheDocument();
  });

  it('renders the result kind with a path', () => {
    setup({ props: { kind: 'result', path: 'a.b' }, ctx: context });
    expect(
      screen.getByText('Mock content: result a.b d c w r')
    ).toBeInTheDocument();
  });

  it('passes the search attribute name', () => {
    setup({
      props: { kind: 'searchAttributes', name: 'CustomKeywordField' },
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
      props: { kind: 'result', workflowId: 'other', runId: 'run-2' },
      ctx: context,
    });
    expect(
      screen.getByText('Mock content: result no-path d c other run-2')
    ).toBeInTheDocument();
  });

  it('does not encode context values again, since they are already encoded', () => {
    setup({
      props: { kind: 'input' },
      ctx: { ...context, workflowId: 'orders%2F42' },
    });
    expect(
      screen.getByText('Mock content: input no-path d c orders%2F42 r')
    ).toBeInTheDocument();
  });

  it('does not inherit the context runId for an explicit workflowId', () => {
    setup({ props: { kind: 'result', workflowId: 'other' }, ctx: context });
    expect(
      screen.getByText('A runId is required when workflowId is set')
    ).toBeInTheDocument();
  });

  it('shows a message when the workflow context is missing', () => {
    setup({ props: { kind: 'input' }, ctx: {} });
    expect(
      screen.getByText(/needs a domain, cluster and workflowId/)
    ).toBeInTheDocument();
  });
});

function setup({ props, ctx }: { props: Props; ctx: Record<string, string> }) {
  render(
    <MarkdownContext.Provider value={ctx}>
      <MarkdocWorkflowPayload {...props} />
    </MarkdownContext.Provider>
  );
}
