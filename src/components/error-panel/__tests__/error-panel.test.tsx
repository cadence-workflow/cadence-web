import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import ErrorPanel from '../error-panel';
import { type ErrorAction } from '../error-panel.types';

const mockRouterPush = jest.fn();
const mockRouterRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockRouterPush,
    back: () => {},
    replace: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: mockRouterRefresh,
  }),
}));

const mockError = jest.fn();
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: {
    error: () => mockError(),
  },
}));

const mockResetQueryErrors = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryErrorResetBoundary: () => ({
    reset: mockResetQueryErrors,
  }),
}));

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdRefresh: () => <div>Refresh Icon</div>,
  MdOpenInNew: () => <div>Open in New Icon</div>,
}));

const mockCallback = jest.fn();
const mockActions: Array<ErrorAction> = [
  {
    kind: 'retry',
    label: 'Retry',
  },
  {
    kind: 'link-external',
    label: 'External Link',
    link: 'https://www.external-link.com',
  },
  {
    kind: 'link-internal',
    label: 'Internal Link',
    link: '/mock/internal/link',
  },
  {
    kind: 'callback',
    label: 'Run Callback',
    onClick: () => mockCallback(),
    buttonKind: 'primary',
  },
];

afterEach(() => {
  jest.resetAllMocks();
});

describe(ErrorPanel.name, () => {
  it('should render correctly without any actions if there are none', async () => {
    setup({ message: 'Mock error message' });

    expect(screen.getByAltText('Error')).toBeInTheDocument();
    expect(screen.getByText('Mock error message')).toBeInTheDocument();
  });

  it('should emit log if an error is passed', async () => {
    setup({
      message: 'Mock error message',
      error: new Error('something bad happened'),
    });

    expect(mockError).toHaveBeenCalled();
  });

  it('should not emit log if an error is passed but omitLogging is true', async () => {
    setup({
      message: 'Mock error message',
      error: new Error('Something was not found'),
      omitLogging: true,
    });

    expect(mockError).not.toHaveBeenCalled();
  });

  it('should render correctly with actions', async () => {
    setup({ message: 'Mock error message', actions: mockActions });

    expect(screen.getByText('Mock error message')).toBeInTheDocument();

    const resetButton = screen.getByText('Retry').parentElement;
    expect(resetButton).not.toBeNull();
    // This check is pretty much meaningless, since we assert right above that it is non-null
    if (resetButton !== null) {
      expect(within(resetButton).getByText('Refresh Icon')).toBeInTheDocument();
    }

    const extLinkButton = screen.getByText('External Link').parentElement;
    expect(extLinkButton).not.toBeNull();
    // This check is pretty much meaningless, since we assert right above that it is non-null
    if (extLinkButton !== null) {
      expect(
        within(extLinkButton).getByText('Open in New Icon')
      ).toBeInTheDocument();
    }

    expect(screen.getByText('Internal Link')).toBeInTheDocument();
    expect(screen.getByText('Run Callback')).toBeInTheDocument();
  });

  it('should perform the Reset action', async () => {
    const { user, mockReset } = setup({
      message: 'Mock error message',
      actions: mockActions,
    });

    await user.click(screen.getByText('Retry'));

    expect(mockRouterRefresh).toHaveBeenCalled();
    expect(mockResetQueryErrors).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
  });

  it('should perform the External Link action', async () => {
    const { user, mockWindowOpen } = setup({
      message: 'Mock error message',
      actions: mockActions,
    });

    await user.click(screen.getByText('External Link'));

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.external-link.com'
    );
  });

  it('should perform the Internal Link action', async () => {
    const { user } = setup({
      message: 'Mock error message',
      actions: mockActions,
    });

    await user.click(screen.getByText('Internal Link'));

    expect(mockRouterPush).toHaveBeenCalledWith('/mock/internal/link');
  });

  it('should perform the Callback action', async () => {
    const { user } = setup({
      message: 'Mock error message',
      actions: mockActions,
    });

    await user.click(screen.getByText('Run Callback'));

    expect(mockCallback).toHaveBeenCalled();
  });

  it('renders the description when provided', () => {
    setup({
      message: 'Mock error message',
      description: 'Mock description copy',
    });

    expect(screen.getByText('Mock description copy')).toBeInTheDocument();
  });

  it('renders a custom startEnhancer', () => {
    setup({
      message: 'Mock error message',
      actions: [
        {
          kind: 'callback',
          label: 'Custom CTA',
          onClick: () => undefined,
          startEnhancer: <span data-testid="custom-start-enhancer">+</span>,
        },
      ],
    });

    const ctaButton = screen.getByText('Custom CTA').closest('button');
    expect(ctaButton).not.toBeNull();
    expect(
      within(ctaButton!).getByTestId('custom-start-enhancer')
    ).toBeInTheDocument();
  });

  it('renders a custom endEnhancer', () => {
    setup({
      message: 'Mock error message',
      actions: [
        {
          kind: 'callback',
          label: 'Custom CTA',
          onClick: () => undefined,
          endEnhancer: <span data-testid="custom-end-enhancer">→</span>,
        },
      ],
    });

    const ctaButton = screen.getByText('Custom CTA').closest('button');
    expect(ctaButton).not.toBeNull();
    expect(
      within(ctaButton!).getByTestId('custom-end-enhancer')
    ).toBeInTheDocument();
  });

  it('lets a custom startEnhancer override the retry default icon', () => {
    setup({
      message: 'Mock error message',
      actions: [
        {
          kind: 'retry',
          label: 'Retry',
          startEnhancer: <span data-testid="custom-retry-start">⟳</span>,
        },
      ],
    });

    expect(screen.getByTestId('custom-retry-start')).toBeInTheDocument();
    expect(screen.queryByText('Refresh Icon')).toBeNull();
  });

  it('lets a custom endEnhancer override the link-external default icon', () => {
    setup({
      message: 'Mock error message',
      actions: [
        {
          kind: 'link-external',
          label: 'External Link',
          link: 'https://www.external-link.com',
          endEnhancer: <span data-testid="custom-external-end">↗</span>,
        },
      ],
    });
    expect(screen.queryByText('Open in New Icon')).toBeNull();
    expect(screen.getByTestId('custom-external-end')).toBeInTheDocument();
  });
});

function setup({
  message,
  description,
  error,
  actions,
  omitLogging,
}: {
  message: string;
  description?: React.ReactNode;
  error?: Error;
  actions?: Array<ErrorAction>;
  omitLogging?: boolean;
}) {
  const mockReset = jest.fn();
  const mockWindowOpen = jest.fn();
  jest.spyOn(window, 'open').mockImplementation(mockWindowOpen);
  const user = userEvent.setup();
  render(
    <ErrorPanel
      message={message}
      description={description}
      error={error}
      actions={actions}
      reset={mockReset}
      omitLogging={omitLogging}
    />
  );
  return { user, mockReset, mockWindowOpen };
}
