import { useContext } from 'react';

import { render, screen } from '@testing-library/react';

import Markdown from '@/components/markdown/markdown';
import { MarkdownPageContext } from '@/components/markdown/markdown-page-context';

// Mock the signal/start buttons to avoid needing full workflow context, while
// still capturing the markdoc-supplied props and the ambient MarkdownPageContext
// so we can verify page params actually reach descendants of <Markdown>.
const mockSignalButtonProps: Record<string, unknown>[] = [];
const mockSignalButtonContexts: Record<string, unknown>[] = [];
function MockSignalButton(props: Record<string, unknown>) {
  mockSignalButtonProps.push(props);
  mockSignalButtonContexts.push(useContext(MarkdownPageContext));
  return <button data-testid="signal-button">{props.label as string}</button>;
}
jest.mock(
  '@/components/markdown/markdoc-components/signal-button/signal-button',
  () => MockSignalButton
);

const mockStartButtonProps: Record<string, unknown>[] = [];
const mockStartButtonContexts: Record<string, unknown>[] = [];
function MockStartWorkflowButton(props: Record<string, unknown>) {
  mockStartButtonProps.push(props);
  mockStartButtonContexts.push(useContext(MarkdownPageContext));
  return (
    <button data-testid="start-workflow-button">{props.label as string}</button>
  );
}
jest.mock(
  '@/components/markdown/markdoc-components/start-workflow-button/start-workflow-button',
  () => MockStartWorkflowButton
);

describe('Markdown with Markdoc', () => {
  beforeEach(() => {
    mockSignalButtonProps.length = 0;
    mockSignalButtonContexts.length = 0;
    mockStartButtonProps.length = 0;
    mockStartButtonContexts.length = 0;
  });

  it('renders basic markdown', () => {
    const content = '# Hello World\n\nThis is a test.';
    render(<Markdown markdown={content} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is a test.')).toBeInTheDocument();
  });

  it('renders signal button tags', () => {
    const content = `
# Test

{% signal signalName="test" label="Click Me" /%}
    `;
    render(<Markdown markdown={content} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByTestId('signal-button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders multiple signal buttons', () => {
    const content = `
# Actions

{% signal signalName="approve" label="Approve" /%}
{% signal signalName="reject" label="Reject" /%}
    `;
    render(<Markdown markdown={content} />);

    const buttons = screen.getAllByTestId('signal-button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('renders markdown with mixed content', () => {
    const content = `
# Approval Required

Please review the following:

- Item 1
- Item 2
- Item 3

{% signal signalName="approve" label="Approve All" /%}
    `;
    render(<Markdown markdown={content} />);

    expect(screen.getByText('Approval Required')).toBeInTheDocument();
    expect(
      screen.getByText('Please review the following:')
    ).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Approve All')).toBeInTheDocument();
  });

  it('renders code blocks', () => {
    const content = `
# Code Example

\`\`\`javascript
console.log('Hello');
\`\`\`
    `;
    render(<Markdown markdown={content} />);

    expect(screen.getByText('Code Example')).toBeInTheDocument();
    expect(screen.getByText("console.log('Hello');")).toBeInTheDocument();
  });

  it('renders inline code', () => {
    const content = 'Use the `signal` tag.';
    render(<Markdown markdown={content} />);

    expect(screen.getByText('signal')).toBeInTheDocument();
  });

  it('renders links', () => {
    const content = '[Click here](https://example.com)';
    render(<Markdown markdown={content} />);

    const link = screen.getByText('Click here');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('renders lists', () => {
    const content = `
- First item
- Second item
- Third item
    `;
    render(<Markdown markdown={content} />);

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders emphasis and strong', () => {
    const content = '**Bold text** and *italic text*';
    render(<Markdown markdown={content} />);

    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });

  describe('page params context propagation', () => {
    it('provides domain/cluster/workflowId/runId props to MarkdownPageContext for descendants', () => {
      const content = '{% signal signalName="test" label="Go" /%}';
      render(
        <Markdown
          markdown={content}
          domain="my-domain"
          cluster="cluster0"
          workflowId="wf-123"
          runId="run-456"
        />
      );

      expect(screen.getByTestId('signal-button')).toBeInTheDocument();
      expect(mockSignalButtonContexts).toHaveLength(1);
      expect(mockSignalButtonContexts[0]).toEqual({
        domain: 'my-domain',
        cluster: 'cluster0',
        workflowId: 'wf-123',
        runId: 'run-456',
      });
    });

    it('provides an empty context when <Markdown> receives no page params', () => {
      const content = '{% signal signalName="test" label="Go" /%}';
      render(<Markdown markdown={content} />);

      expect(mockSignalButtonContexts).toHaveLength(1);
      expect(mockSignalButtonContexts[0]).toEqual({
        domain: undefined,
        cluster: undefined,
        workflowId: undefined,
        runId: undefined,
      });
    });

    it('passes explicit tag attributes through as props regardless of page context', () => {
      const content =
        '{% signal signalName="s" label="L" domain="other" cluster="c1" workflowId="w1" runId="r1" /%}';
      render(
        <Markdown
          markdown={content}
          domain="page-domain"
          cluster="page-cluster"
          workflowId="page-wf"
          runId="page-run"
        />
      );

      expect(mockSignalButtonProps).toHaveLength(1);
      expect(mockSignalButtonProps[0]).toMatchObject({
        domain: 'other',
        cluster: 'c1',
        workflowId: 'w1',
        runId: 'r1',
      });
      // The context is still available for the button to fall back to,
      // even though this particular tag doesn't need it.
      expect(mockSignalButtonContexts[0]).toEqual({
        domain: 'page-domain',
        cluster: 'page-cluster',
        workflowId: 'page-wf',
        runId: 'page-run',
      });
    });

    it('provides the same page context to start workflow button descendants', () => {
      const content =
        '{% start workflowType="MyWorkflow" label="Start" taskList="tl" /%}';
      render(
        <Markdown
          markdown={content}
          domain="my-domain"
          cluster="cluster0"
          workflowId="wf-123"
          runId="run-456"
        />
      );

      expect(screen.getByTestId('start-workflow-button')).toBeInTheDocument();
      expect(mockStartButtonProps).toHaveLength(1);
      expect(mockStartButtonProps[0]).toMatchObject({
        workflowType: 'MyWorkflow',
        label: 'Start',
        taskList: 'tl',
      });
      expect(mockStartButtonContexts[0]).toEqual({
        domain: 'my-domain',
        cluster: 'cluster0',
        workflowId: 'wf-123',
        runId: 'run-456',
      });
    });
  });
});
