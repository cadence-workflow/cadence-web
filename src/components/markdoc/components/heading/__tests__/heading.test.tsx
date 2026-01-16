import React from 'react';

import { render, screen } from '@testing-library/react';

import Heading from '../heading';

describe('Heading', () => {
  it('renders h1 when level is 1', () => {
    render(<Heading level={1}>Heading 1</Heading>);

    const heading = screen.getByText('Heading 1');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders h2 when level is 2', () => {
    render(<Heading level={2}>Heading 2</Heading>);

    const heading = screen.getByText('Heading 2');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('renders h3 when level is 3', () => {
    render(<Heading level={3}>Heading 3</Heading>);

    const heading = screen.getByText('Heading 3');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('passes additional props to the heading element', () => {
    render(
      <Heading level={2} id="custom-id" className="custom-class">
        Custom Heading
      </Heading>
    );

    const heading = screen.getByText('Custom Heading');
    expect(heading).toHaveAttribute('id', 'custom-id');
    expect(heading).toHaveClass('custom-class');
  });

  it('renders without children', () => {
    const { container } = render(<Heading level={1} />);

    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
