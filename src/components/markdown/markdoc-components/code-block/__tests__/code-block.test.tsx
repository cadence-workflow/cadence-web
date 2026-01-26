import React from 'react';

import { render, screen } from '@testing-library/react';

import CodeBlock from '../code-block';

describe('CodeBlock', () => {
  it('renders code content', () => {
    const code = 'const x = 1;';
    render(<CodeBlock content={code} />);

    expect(screen.getByText(code)).toBeInTheDocument();
  });

  it('applies language class when language is provided', () => {
    const { container } = render(
      <CodeBlock language="javascript" content="const x = 1;" />
    );

    const codeElement = container.querySelector('code');
    expect(codeElement).toHaveClass('language-javascript');
  });

  it('does not apply language class when language is not provided', () => {
    const { container } = render(<CodeBlock content="const x = 1;" />);

    const codeElement = container.querySelector('code');
    expect(codeElement?.className).toBe('');
  });

  it('wraps code in pre tag', () => {
    const { container } = render(<CodeBlock content="test" />);

    const preElement = container.querySelector('pre');
    expect(preElement).toBeInTheDocument();

    const codeElement = preElement?.querySelector('code');
    expect(codeElement).toBeInTheDocument();
  });

  it('handles multiline code', () => {
    const code = 'line 1\nline 2\nline 3';
    const { container } = render(<CodeBlock content={code} />);

    const codeElement = container.querySelector('code');
    expect(codeElement?.textContent).toBe(code);
  });
});
