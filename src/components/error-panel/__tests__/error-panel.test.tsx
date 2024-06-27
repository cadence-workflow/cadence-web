import React from 'react';

import { render, screen, act, fireEvent, within } from '@/test-utils/rtl';

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
  });

  it('should perform the Reset action', async () => {
    const { mockReset } = setup({
      message: 'Mock error message',
      actions: mockActions,
    });

    const resetButtonText = screen.getByText('Retry');
    act(() => {
      fireEvent.click(resetButtonText);
    });

    expect(mockRouterRefresh).toHaveBeenCalled();
    expect(mockResetQueryErrors).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
  });

  it('should perform the External Link action', async () => {
    const { mockWindowOpen } = setup({
      message: 'Mock error message',
      actions: mockActions,
    });

    const extLinkButtonText = screen.getByText('External Link');
    act(() => {
      fireEvent.click(extLinkButtonText);
    });

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.external-link.com'
    );
  });

  it('should perform the Internal Link action', async () => {
    setup({ message: 'Mock error message', actions: mockActions });

    const intLinkButtonText = screen.getByText('Internal Link');
    act(() => {
      fireEvent.click(intLinkButtonText);
    });

    expect(mockRouterPush).toHaveBeenCalledWith('/mock/internal/link');
  });
});

function setup({
  message,
  actions,
}: {
  message: string;
  actions?: Array<ErrorAction>;
}) {
  const mockReset = jest.fn();
  const mockWindowOpen = jest.fn();
  jest.spyOn(window, 'open').mockImplementation(mockWindowOpen);
  render(<ErrorPanel message={message} actions={actions} reset={mockReset} />);
  return { mockReset, mockWindowOpen };
}
