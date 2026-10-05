import { type StepMerged } from 'react-joyride';

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

const baseStep = {
  target: 'body',
  content: 'Default step content',
} as unknown as StepMerged;

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
  index: 0,
  step: baseStep,
} as const;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GuidedTourTooltip', () => {
  it('renders step title and content', () => {
    render(
      <GuidedTourTooltip
        {...baseProps}
        step={{ ...baseStep, title: 'Welcome', content: 'This is a tour' }}
      />
    );

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('This is a tour')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<GuidedTourTooltip {...baseProps} index={2} />);

    expect(screen.getByText('3 of 5')).toBeInTheDocument();
  });

  it('hides Back button on first step', () => {
    render(<GuidedTourTooltip {...baseProps} index={0} />);

    expect(screen.queryByText('Back')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows Back button on subsequent steps', () => {
    render(<GuidedTourTooltip {...baseProps} index={1} />);

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('shows Done instead of Next on last step', () => {
    render(<GuidedTourTooltip {...baseProps} index={4} isLastStep={true} />);

    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('invokes closeProps.onClick when close button is clicked', () => {
    render(<GuidedTourTooltip {...baseProps} />);

    fireEvent.click(screen.getByLabelText('Close'));

    expect(baseProps.closeProps.onClick).toHaveBeenCalled();
  });

  it('invokes primaryProps.onClick when Next is clicked', () => {
    render(<GuidedTourTooltip {...baseProps} />);

    fireEvent.click(screen.getByText('Next'));

    expect(baseProps.primaryProps.onClick).toHaveBeenCalled();
  });

  it('invokes backProps.onClick when Back is clicked', () => {
    render(<GuidedTourTooltip {...baseProps} index={1} />);

    fireEvent.click(screen.getByText('Back'));

    expect(baseProps.backProps.onClick).toHaveBeenCalled();
  });
});
