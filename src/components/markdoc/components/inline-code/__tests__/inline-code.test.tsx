import React from 'react';

import { render, screen } from '@testing-library/react';

import InlineCode from '../inline-code';

describe('InlineCode', () => {
  it('renders code content from content prop', () => {
    render(<InlineCode content="inline code" />);

    expect(screen.getByText('inline code')).toBeInTheDocument();
  });

  it('renders code content from children', () => {
    render(<InlineCode>child code</InlineCode>);

    expect(screen.getByText('child code')).toBeInTheDocument();
  });

  it('prefers content prop over children', () => {
    render(<InlineCode content="content">children</InlineCode>);

    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.queryByText('children')).not.toBeInTheDocument();
  });

  it('renders as code element', () => {
    const { container } = render(<InlineCode content="test" />);

    const codeElement = container.querySelector('code');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement?.textContent).toBe('test');
  });

  it('does not wrap in pre tag', () => {
    const { container } = render(<InlineCode content="test" />);

    const preElement = container.querySelector('pre');
    expect(preElement).not.toBeInTheDocument();
  });
});
