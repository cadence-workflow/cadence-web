import { render, screen, act } from '@/test-utils/rtl';

import GuidedTourProvider from '../guided-tour-provider';
import * as storage from '../guided-tour-storage';

jest.mock('../guided-tour-storage', () => ({
  __esModule: true,
  isTourCompleted: jest.fn(),
  markTourCompleted: jest.fn(),
}));

jest.mock('react-joyride', () => {
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

  let onEventCallback: ((...args: unknown[]) => void) | undefined;
  let onCallback: ((...args: unknown[]) => void) | undefined;

  return {
    __esModule: true,
    useJoyride: jest.fn((props: { onEvent?: (...args: unknown[]) => void }) => {
      onEventCallback = props.onEvent;
      return {
        controls: mockControls,
        on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
          if (event === 'tour:end') {
            onCallback = handler;
          }
          return jest.fn();
        }),
        Tour: <div data-testid="joyride-tour" />,
        state: {},
        step: null,
        failures: [],
      };
    }),
    ORIGIN: { OVERLAY: 'overlay' },
    get _mockControls() {
      return mockControls;
    },
    get _triggerOnEvent() {
      return onEventCallback;
    },
    get _triggerTourEnd() {
      return onCallback;
    },
  };
});

const mockJoyride = jest.requireMock('react-joyride');

const steps = [
  { target: 'body', content: 'Welcome', title: 'Test' },
  { target: '.step-two', content: 'Step 2' },
];

function setup(props?: { tourId?: string; autoStart?: boolean }) {
  const tourId = props?.tourId ?? 'test-tour';
  const autoStart = props?.autoStart;

  return render(
    <GuidedTourProvider tourId={tourId} steps={steps} autoStart={autoStart}>
      <div>child content</div>
    </GuidedTourProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GuidedTourProvider', () => {
  it('renders children and the Tour element', () => {
    setup();

    expect(screen.getByText('child content')).toBeInTheDocument();
    expect(screen.getByTestId('joyride-tour')).toBeInTheDocument();
  });

  it('auto-starts tour on first visit when not previously completed', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(false);

    setup();

    expect(storage.isTourCompleted).toHaveBeenCalledWith('test-tour');
    expect(mockJoyride._mockControls.start).toHaveBeenCalled();
  });

  it('does not auto-start when tour is already completed', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(true);

    setup();

    expect(mockJoyride._mockControls.start).not.toHaveBeenCalled();
  });

  it('does not auto-start when autoStart is false', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(false);

    setup({ autoStart: false });

    expect(mockJoyride._mockControls.start).not.toHaveBeenCalled();
  });

  it('uses tour-specific id when checking completion', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(false);

    setup({ tourId: 'my-feature-tour' });

    expect(storage.isTourCompleted).toHaveBeenCalledWith('my-feature-tour');
  });

  it('marks tour as completed on tour end', () => {
    setup({ tourId: 'domain-overview' });

    act(() => {
      mockJoyride._triggerTourEnd?.();
    });

    expect(storage.markTourCompleted).toHaveBeenCalledWith('domain-overview');
  });

  it('skips tour when overlay is clicked', () => {
    setup();

    act(() => {
      mockJoyride._triggerOnEvent?.(
        { origin: 'overlay' },
        mockJoyride._mockControls
      );
    });

    expect(mockJoyride._mockControls.skip).toHaveBeenCalled();
  });
});
