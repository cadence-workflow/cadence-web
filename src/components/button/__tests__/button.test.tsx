import React from 'react';

import { Button as mockBaseUIButton } from 'baseui/button';

import { render, screen, userEvent } from '@/test-utils/rtl';

import Button from '../button';
import { type Props } from '../button.types';

jest.mock('baseui/button', () => {
  return {
    Button: jest.fn((props) => <button>{props.children}</button>),
  };
});

describe('Button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with text content children', async () => {
    await setup({ children: 'Click me' });

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('renders button with React node children', async () => {
    setup({
      children: <span>Custom content</span>,
    });

    const button = screen.getByRole('button');
    const span = screen.getByText('Custom content');
    expect(span.tagName).toBe('SPAN');
    expect(button).toContainElement(span);
  });

  it('renders skeleton loader component when in skeleton loading state', async () => {
    await setup({
      children: 'Skeleton button',
      isLoading: true,
      loadingIndicatorType: 'skeleton',
    });

    const button = screen.getByRole('button', {
      name: 'Skeleton button',
    });
    expect(button).toBeInTheDocument();

    const skeletonLoader = screen.getByTestId('skeleton-loader');
    expect(skeletonLoader).toBeInTheDocument();
    expect(button).toContainElement(skeletonLoader);
  });

  it('applies correct aria-label for skeleton loading with string children', async () => {
    await setup({
      children: 'Save changes',
      isLoading: true,
      loadingIndicatorType: 'skeleton',
    });

    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        'aria-label': 'loading Save changes',
      }),
      expect.anything()
    );
  });

  it('applies default aria-label for skeleton loading with non-string children', async () => {
    await setup({
      children: <span>Complex content</span>,
      isLoading: true,
      loadingIndicatorType: 'skeleton',
    });
    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        'aria-label': 'content is loading',
      }),
      expect.anything()
    );
  });

  it('prevents click events during skeleton loading', async () => {
    const handleClick = jest.fn();
    const { user } = await setup({
      children: 'Skeleton button',
      isLoading: true,
      loadingIndicatorType: 'skeleton',
      onClick: handleClick,
    });

    const button = screen.getByRole('button', {
      name: 'Skeleton button',
    });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
  it('passes isLoading to the button if loadingIndicatorType is not skeleton', async () => {
    const { mockBaseUIButton } = await setup({
      children: 'Loading button',
      isLoading: true,
    });

    // Verify that isLoading is passed to the BaseUI Button
    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: true,
      }),
      expect.anything()
    );
  });

  it('sets isLoading to false during skeleton loading', async () => {
    const { mockBaseUIButton } = await setup({
      children: 'Skeleton button',
      isLoading: true,
      loadingIndicatorType: 'skeleton',
    });

    // Verify that isLoading is set to false for BaseUI Button during skeleton loading
    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: false,
      }),
      expect.anything()
    );
  });

  it('merges external overrides correctly', async () => {
    const externalOverrides = {
      BaseButton: {
        style: {
          backgroundColor: 'red',
        },
      },
    };

    const { mockBaseUIButton } = await setup({
      children: 'Button with overrides',
      overrides: externalOverrides,
    });

    // Verify that external overrides are merged and passed to BaseUI Button
    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        overrides: expect.objectContaining({
          BaseButton: expect.objectContaining({
            style: expect.objectContaining({
              backgroundColor: 'red',
            }),
          }),
        }),
      }),
      expect.anything()
    );
  });

  it('applies default loadingIndicatorType as spinner', async () => {
    const { mockBaseUIButton } = await setup({
      children: 'Default loading',
      isLoading: true,
    });

    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: true,
      }),
      expect.anything()
    );
  });

  it('passes through all other BaseUI Button props', async () => {
    const { mockBaseUIButton } = await setup({
      children: 'Custom button',
      size: 'compact',
      kind: 'secondary',
      shape: 'pill',
    });

    expect(mockBaseUIButton).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'compact',
        kind: 'secondary',
        shape: 'pill',
      }),
      expect.anything()
    );
  });

  it('handles empty children gracefully', async () => {
    await setup({ children: '' });

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });
});

async function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  const renderResult = render(<Button {...props}>{props.children}</Button>);

  return {
    user,
    mockBaseUIButton: mockBaseUIButton as jest.Mock,
    ...renderResult,
  };
}
