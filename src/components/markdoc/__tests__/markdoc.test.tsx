import React from 'react';

import { render, screen } from '@testing-library/react';

import MarkdocRenderer from '../markdoc';

// Mock the signal button to avoid needing full workflow context
jest.mock('@/components/signal-button/signal-button', () => {
  return function MockSignalButton({ label }: { label: string }) {
    return <button data-testid="signal-button">{label}</button>;
  };
});

describe('MarkdocRenderer', () => {
  const defaultProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  };

  it('renders basic markdown', () => {
    const content = '# Hello World\n\nThis is a test.';
    render(<MarkdocRenderer {...defaultProps} content={content} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is a test.')).toBeInTheDocument();
  });

  it('renders signal button tags', () => {
    const content = `
# Test

{% signal-button signalName="test" label="Click Me" /%}
    `;
    render(<MarkdocRenderer {...defaultProps} content={content} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByTestId('signal-button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders multiple signal buttons', () => {
    const content = `
# Actions

{% signal-button signalName="approve" label="Approve" /%}
{% signal-button signalName="reject" label="Reject" /%}
    `;
    render(<MarkdocRenderer {...defaultProps} content={content} />);

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

{% signal-button signalName="approve" label="Approve All" /%}
    `;
    render(<MarkdocRenderer {...defaultProps} content={content} />);

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
    render(<MarkdocRenderer {...defaultProps} content={content} />);

    expect(screen.getByText('Code Example')).toBeInTheDocument();
    expect(screen.getByText("console.log('Hello');")).toBeInTheDocument();
  });

  it('renders inline code', () => {
    const content = 'Use the `signal-button` tag.';
    render(<MarkdocRenderer {...defaultProps} content={content} />);

    expect(screen.getByText('signal-button')).toBeInTheDocument();
  });

  it('renders links', () => {
    const content = '[Click here](https://example.com)';
    render(<MarkdocRenderer {...defaultProps} content={content} />);

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
    render(<MarkdocRenderer {...defaultProps} content={content} />);

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders emphasis and strong', () => {
    const content = '**Bold text** and *italic text*';
    render(<MarkdocRenderer {...defaultProps} content={content} />);

    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });
});
