import { render, screen, fireEvent } from '@/test-utils/rtl';

import GuidedTourTooltip from '../guided-tour-tooltip';

const mockControls = {
  start: jest.fn(),
  stop: jest.fn(),
  next: jest.fn(),
  prev: jest.fn(),
  skip: jest.fn(),
  close: jest.fn(),
  go: jest.fn(),
  open: jest.fn(),
  reset: jest.fn(),
  info: jest.fn(),
};

const baseProps = {
  backProps: {
    'aria-label': 'Back',
    'data-action': 'back',
    onClick: jest.fn(),
    role: 'button',
    title: 'Back',
  },
  closeProps: {
    'aria-label': 'Close',
    'data-action': 'close',
    onClick: jest.fn(),
    role: 'button',
    title: 'Close',
  },
  controls: mockControls,
  primaryProps: {
    'aria-label': 'Next',
    'data-action': 'primary',
    onClick: jest.fn(),
    role: 'button',
    title: 'Next',
  },
  skipProps: {
    'aria-label': 'Skip',
    'data-action': 'skip',
    onClick: jest.fn(),
    role: 'button',
    title: 'Skip',
  },
  tooltipProps: {
    'aria-modal': true,
    id: 'joyride-tooltip',
    role: 'dialog',
  },
  continuous: true,
  isLastStep: false,
  size: 5,
} as const;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GuidedTourTooltip', () => {
  it('renders step title and content', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={0}
        step={{ title: 'Welcome', content: 'This is a tour' } as any}
      />
    );

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('This is a tour')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={2}
        step={{ content: 'Step content' } as any}
      />
    );

    expect(screen.getByText('3 of 5')).toBeInTheDocument();
  });

  it('hides Back button on first step', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={0}
        step={{ content: 'First step' } as any}
      />
    );

    expect(screen.queryByText('Back')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows Back button on subsequent steps', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={1}
        step={{ content: 'Second step' } as any}
      />
    );

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('shows Done instead of Next on last step', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={4}
        isLastStep={true}
        step={{ content: 'Last step' } as any}
      />
    );

    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('calls controls.skip() when close button is clicked', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={0}
        step={{ content: 'Content' } as any}
      />
    );

    fireEvent.click(screen.getByLabelText('Close tour'));

    expect(mockControls.skip).toHaveBeenCalled();
  });

  it('calls controls.next() when Next is clicked', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={0}
        step={{ content: 'Content' } as any}
      />
    );

    fireEvent.click(screen.getByText('Next'));

    expect(mockControls.next).toHaveBeenCalled();
  });

  it('calls controls.prev() when Back is clicked', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        index={1}
        step={{ content: 'Content' } as any}
      />
    );

    fireEvent.click(screen.getByText('Back'));

    expect(mockControls.prev).toHaveBeenCalled();
  });
});
