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
  it('renders basic markdown', () => {
    const content = '# Hello World\n\nThis is a test.';
    render(<MarkdocRenderer content={content} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is a test.')).toBeInTheDocument();
  });

  it('renders signal button tags', () => {
    const content = `
# Test

{% signal signalName="test" label="Click Me" /%}
    `;
    render(<MarkdocRenderer content={content} />);

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
    render(<MarkdocRenderer content={content} />);

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
    render(<MarkdocRenderer content={content} />);

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
    render(<MarkdocRenderer content={content} />);

    expect(screen.getByText('Code Example')).toBeInTheDocument();
    expect(screen.getByText("console.log('Hello');")).toBeInTheDocument();
  });

  it('renders inline code', () => {
    const content = 'Use the `signal` tag.';
    render(<MarkdocRenderer content={content} />);

    expect(screen.getByText('signal')).toBeInTheDocument();
  });

  it('renders links', () => {
    const content = '[Click here](https://example.com)';
    render(<MarkdocRenderer content={content} />);

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
    render(<MarkdocRenderer content={content} />);

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders emphasis and strong', () => {
    const content = '**Bold text** and *italic text*';
    render(<MarkdocRenderer content={content} />);

    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });
});
