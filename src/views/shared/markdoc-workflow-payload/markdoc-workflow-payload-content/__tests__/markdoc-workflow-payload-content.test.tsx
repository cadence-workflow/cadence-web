import { render, screen } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';
import useWorkflowPayloads from '@/views/shared/hooks/use-workflow-payloads/use-workflow-payloads';
import { type UseWorkflowPayloadsReturn } from '@/views/shared/hooks/use-workflow-payloads/use-workflow-payloads.types';

import MarkdocWorkflowPayloadContent from '../markdoc-workflow-payload-content';
import { type Props } from '../markdoc-workflow-payload-content.types';

jest.mock('@/views/shared/hooks/use-workflow-payloads/use-workflow-payloads');
const mockHook = jest.mocked(useWorkflowPayloads);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => <div>Mock JSON: {JSON.stringify(json)}</div>)
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

const baseState: UseWorkflowPayloadsReturn = {
  input: [{ order: { id: 7, items: ['a', 'b'] } }],
  result: 'done',
  searchAttributes: {
    CustomKeywordField: 'pending',
    CustomDoubleField: 12.5,
  },
  isRunning: false,
  isArchived: false,
  isLoading: false,
  error: null,
};

describe(MarkdocWorkflowPayloadContent.name, () => {
  it('renders object input as JSON', () => {
    setup({ kind: 'input' });
    expect(screen.getByText(/Mock JSON:/)).toBeInTheDocument();
  });

  it('renders a scalar result as plain text', () => {
    setup({ kind: 'result' });
    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('applies the path to the payload', () => {
    mockHook.mockReturnValue({
      ...baseState,
      input: { order: { id: 7 } },
    });
    render(
      <MarkdocWorkflowPayloadContent {...props} kind="input" path="order.id" />
    );
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows a placeholder when the path has no value', () => {
    mockHook.mockReturnValue({ ...baseState, input: { a: 1 } });
    render(<MarkdocWorkflowPayloadContent {...props} kind="input" path="b" />);
    expect(screen.getByText('No value')).toBeInTheDocument();
  });

  it('shows that a running workflow has no result yet', () => {
    setup({ kind: 'result', state: { isRunning: true } });
    expect(screen.getByText('Workflow is still running')).toBeInTheDocument();
  });

  it('shows that the result of an archived workflow is in history', () => {
    setup({ kind: 'result', state: { isArchived: true } });
    expect(screen.getByText(/archived/)).toBeInTheDocument();
  });

  it('renders all search attributes as JSON', () => {
    setup({ kind: 'searchAttributes' });
    expect(screen.getByText(/Mock JSON:/)).toBeInTheDocument();
    expect(screen.getByText(/CustomKeywordField/)).toBeInTheDocument();
  });

  it('renders one search attribute by name as text', () => {
    mockHook.mockReturnValue(baseState);
    render(
      <MarkdocWorkflowPayloadContent
        {...props}
        kind="searchAttributes"
        name="CustomKeywordField"
      />
    );
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('shows a placeholder when the named search attribute is missing', () => {
    mockHook.mockReturnValue(baseState);
    render(
      <MarkdocWorkflowPayloadContent
        {...props}
        kind="searchAttributes"
        name="Nope"
      />
    );
    expect(screen.getByText('No value')).toBeInTheDocument();
  });

  it('shows a placeholder when there are no search attributes', () => {
    setup({
      kind: 'searchAttributes',
      state: { searchAttributes: undefined },
    });
    expect(screen.getByText('No value')).toBeInTheDocument();
  });

  it('shows search attributes of a running workflow', () => {
    setup({ kind: 'searchAttributes', state: { isRunning: true } });
    expect(screen.getByText(/Mock JSON:/)).toBeInTheDocument();
    expect(
      screen.queryByText('Workflow is still running')
    ).not.toBeInTheDocument();
  });

  it('shows an error message when loading fails', () => {
    setup({
      kind: 'input',
      state: { error: new RequestError('x', '/api/test', 500) },
    });
    expect(
      screen.getByText('Failed to load workflow data')
    ).toBeInTheDocument();
  });
});

const props = {
  domain: 'd',
  cluster: 'c',
  workflowId: 'w',
  runId: 'r',
};

function setup({
  kind,
  state,
}: {
  kind: Props['kind'];
  state?: Partial<UseWorkflowPayloadsReturn>;
}) {
  mockHook.mockReturnValue({ ...baseState, ...state });
  render(<MarkdocWorkflowPayloadContent {...props} kind={kind} />);
}
