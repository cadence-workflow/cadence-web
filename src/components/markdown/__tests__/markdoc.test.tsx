import React from 'react';

import { render, screen } from '@testing-library/react';

import Markdown from '@/components/markdown/markdown';

// Mock the signal button, capturing all received props
const mockSignalButtonProps: Record<string, unknown>[] = [];
jest.mock(
  '@/components/markdown/markdoc-components/signal-button/signal-button',
  () => {
    return function MockSignalButton(props: Record<string, unknown>) {
      mockSignalButtonProps.push(props);
      return (
        <button data-testid="signal-button">{props.label as string}</button>
      );
    };
  }
);

// Mock the start workflow button, capturing all received props
const mockStartButtonProps: Record<string, unknown>[] = [];
jest.mock(
  '@/components/markdown/markdoc-components/start-workflow-button/start-workflow-button',
  () => {
    return function MockStartWorkflowButton(props: Record<string, unknown>) {
      mockStartButtonProps.push(props);
      return (
        <button data-testid="start-workflow-button">
          {props.label as string}
        </button>
      );
    };
  }
);

describe('Markdown with Markdoc', () => {
  beforeEach(() => {
    mockSignalButtonProps.length = 0;
    mockStartButtonProps.length = 0;
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

  describe('page context inheritance', () => {
    it('signal button without explicit attrs receives page context via Markdown props', () => {
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
      expect(mockSignalButtonProps).toHaveLength(1);
      expect(mockSignalButtonProps[0]).toMatchObject({
        signalName: 'test',
        label: 'Go',
      });
      // The signal button should NOT receive domain/cluster/workflowId/runId
      // as direct markdoc props (they weren't in the tag) -- the button component
      // itself reads them from context at render time.
    });

    it('signal button with explicit attrs passes them as props (overrides context)', () => {
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
    });

    it('start workflow button without domain/cluster receives page context', () => {
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
    });
  });
});
