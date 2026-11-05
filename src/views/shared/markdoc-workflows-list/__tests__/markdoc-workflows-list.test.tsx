import { render, screen } from '@/test-utils/rtl';

import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

import MarkdocWorkflowsList from '../markdoc-workflows-list';
import { type Props } from '../markdoc-workflows-list.types';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('../markdoc-workflows-list-content', () =>
  jest.fn(({ query, columns, domain, cluster }) => (
    <div>
      Mock content: {query} {columns ?? 'no-columns'} {domain} {cluster}
    </div>
  ))
);

describe(MarkdocWorkflowsList.name, () => {
  it('uses domain and cluster from the markdown context', () => {
    setup({ props: { query: 'q' }, context: { domain: 'd', cluster: 'c' } });
    expect(
      screen.getByText('Mock content: q no-columns d c')
    ).toBeInTheDocument();
  });

  it('prefers explicit props over context', () => {
    setup({
      props: {
        query: 'q',
        columns: 'WorkflowID',
        domain: 'pd',
        cluster: 'pc',
      },
      context: { domain: 'd', cluster: 'c' },
    });
    expect(
      screen.getByText('Mock content: q WorkflowID pd pc')
    ).toBeInTheDocument();
  });

  it('shows an error when the query is missing', () => {
    setup({ props: {}, context: { domain: 'd', cluster: 'c' } });
    expect(
      screen.getByText('Workflows list needs a query, domain and cluster')
    ).toBeInTheDocument();
  });

  it('shows an error when there is no domain or cluster', () => {
    setup({ props: { query: 'q' }, context: {} });
    expect(
      screen.getByText('Workflows list needs a query, domain and cluster')
    ).toBeInTheDocument();
  });
});

function setup({
  props,
  context,
}: {
  props: Props;
  context: { domain?: string; cluster?: string };
}) {
  render(
    <MarkdownContext.Provider value={context}>
      <MarkdocWorkflowsList {...props} />
    </MarkdownContext.Provider>
  );
}
