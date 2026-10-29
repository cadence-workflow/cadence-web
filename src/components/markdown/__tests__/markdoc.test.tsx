import { useContext } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Markdown from '@/components/markdown/markdown';
import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

// Mock the signal button to expose its props and context for assertions.
function MockSignalButton(props: Record<string, unknown>) {
  const context = useContext(MarkdownContext);
  return (
    <>
      <button data-testid="signal-button">{props.label as string}</button>
      <pre data-testid="signal-button-props">{JSON.stringify(props)}</pre>
      <pre data-testid="markdown-context">{JSON.stringify(context)}</pre>
    </>
  );
}
jest.mock(
  '@/components/markdown/markdoc-components/signal-button/signal-button',
  () => MockSignalButton
);

describe('Markdown with Markdoc', () => {
  it('renders an input-field tag as an input', () => {
    render(
      <Markdown
        markdown={
          '{% input-field name="amount" label="Amount" type="number" default=84.5 /%}'
        }
      />
    );

    expect(screen.getByLabelText('Amount')).toHaveValue(84.5);
  });

  it('resolves a field value into the button input', async () => {
    const user = userEvent.setup();
    render(
      <Markdown
        markdown={`{% input-field name="amount" label="Amount" type="number" /%}

{% signal signalName="s" label="Go" input={"amount":$amount} /%}`}
      />
    );

    expect(getButtonProps().input).toEqual({});
    expect(getButtonProps().variableNames).toEqual(['amount']);

    await user.type(screen.getByLabelText('Amount'), '125');

    expect(screen.getByLabelText('Amount')).toHaveValue(125);
    expect(getButtonProps().input).toEqual({ amount: 125 });
  });

  it('drops the key of an empty optional field', async () => {
    const user = userEvent.setup();
    render(
      <Markdown
        markdown={`{% input-field name="note" label="Note" /%}

{% signal signalName="s" label="Go" input={"a":1,"note":$note} /%}`}
      />
    );

    expect(getButtonProps().input).toEqual({ a: 1 });

    await user.type(screen.getByLabelText('Note'), 'hi');

    expect(getButtonProps().input).toEqual({ a: 1, note: 'hi' });
  });

  it('shows the field value in text', async () => {
    const user = userEvent.setup();
    render(
      <Markdown
        markdown={`{% input-field name="amount" label="Amount" type="number" default=5 /%}

Total: {% $amount %}`}
      />
    );

    expect(screen.getByText('Total: 5')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Amount'), '7');

    expect(screen.getByText('Total: 57')).toBeInTheDocument();
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

  it('renders link, image, table, and inline code through styled components', () => {
    const content = `[Cadence](https://cadenceworkflow.io "Docs")

![Logo](https://example.com/logo.png)

| Name | Value |
| ---- | ----- |
| a    | b     |

Use \`code\` here.`;
    render(<Markdown markdown={content} />);

    expect(screen.getByRole('link', { name: 'Cadence' })).toHaveAttribute(
      'href',
      'https://cadenceworkflow.io'
    );
    expect(screen.getByRole('img', { name: 'Logo' })).toHaveAttribute(
      'src',
      'https://example.com/logo.png'
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'b' })).toBeInTheDocument();
    expect(screen.getByText('code').tagName).toBe('CODE');
  });

  it('provides domain/cluster/workflowId/runId props to MarkdownContext for descendants', () => {
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
    expect(screen.getByTestId('markdown-context')).toHaveTextContent(
      JSON.stringify({
        domain: 'my-domain',
        cluster: 'cluster0',
        workflowId: 'wf-123',
        runId: 'run-456',
        fieldValues: {},
        fieldMeta: {},
      })
    );
  });

  it('provides an empty context when <Markdown> receives no page params', () => {
    const content = '{% signal signalName="test" label="Go" /%}';
    render(<Markdown markdown={content} />);

    expect(screen.getByTestId('markdown-context')).toHaveTextContent(
      JSON.stringify({ fieldValues: {}, fieldMeta: {} })
    );
  });

  it('removes field metadata when an input-field tag is removed', () => {
    const field = '{% input-field name="amount" label="Amount" /%}';
    const signal = '{% signal signalName="s" label="Go" /%}';
    const { rerender } = render(
      <Markdown markdown={`${field}\n\n${signal}`} />
    );

    expect(getContext().fieldMeta).toHaveProperty('amount');

    rerender(<Markdown markdown={signal} />);

    expect(getContext().fieldMeta).toEqual({});
  });

  it('removes the old field metadata when a field is renamed', () => {
    const signal = '{% signal signalName="s" label="Go" /%}';
    const { rerender } = render(
      <Markdown
        markdown={`{% input-field name="amount" label="Amount" /%}\n\n${signal}`}
      />
    );

    rerender(
      <Markdown
        markdown={`{% input-field name="total" label="Total" /%}\n\n${signal}`}
      />
    );

    expect(Object.keys(getContext().fieldMeta)).toEqual(['total']);
  });

  it('passes explicit tag attributes through regardless of markdown context', () => {
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

    expect(
      JSON.parse(screen.getByTestId('signal-button-props').textContent ?? '')
    ).toMatchObject({
      domain: 'other',
      cluster: 'c1',
      workflowId: 'w1',
      runId: 'r1',
    });
  });

  it('renders extra tags through extra components', () => {
    function Greeting({ name }: { name: string }) {
      return <span data-testid="greeting">Hello {name}</span>;
    }
    render(
      <Markdown
        markdown={'{% greeting name="Cadence" /%}'}
        extraTags={{
          greeting: {
            render: 'Greeting',
            selfClosing: true,
            attributes: { name: { type: String } },
          },
        }}
        extraComponents={{ Greeting }}
      />
    );

    expect(screen.getByTestId('greeting')).toHaveTextContent('Hello Cadence');
  });
});

function getContext() {
  return JSON.parse(screen.getByTestId('markdown-context').textContent ?? '');
}

function getButtonProps() {
  return JSON.parse(
    screen.getByTestId('signal-button-props').textContent ?? ''
  );
}
