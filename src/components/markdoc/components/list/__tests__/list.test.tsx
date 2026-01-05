import React from 'react';

import { render, screen } from '@testing-library/react';

import List from '../list';

describe('List', () => {
  it('renders unordered list by default', () => {
    const { container } = render(
      <List>
        <li>Item 1</li>
        <li>Item 2</li>
      </List>
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders ordered list when ordered prop is true', () => {
    const { container } = render(
      <List ordered={true}>
        <li>First</li>
        <li>Second</li>
      </List>
    );

    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders unordered list when ordered prop is false', () => {
    const { container } = render(
      <List ordered={false}>
        <li>Item</li>
      </List>
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('renders nested lists', () => {
    const { container } = render(
      <List>
        <li>
          Parent Item
          <List ordered={true}>
            <li>Child 1</li>
            <li>Child 2</li>
          </List>
        </li>
      </List>
    );

    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(screen.getByText('Parent Item')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });
});
