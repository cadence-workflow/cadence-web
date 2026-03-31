import { render, screen, act } from '@/test-utils/rtl';

import getLocalStorageValue from '@/utils/local-storage/get-local-storage-value';
import setLocalStorageValue from '@/utils/local-storage/set-local-storage-value';

import GuidedTourProvider from '../guided-tour-provider';

jest.mock('@/utils/local-storage/get-local-storage-value', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/utils/local-storage/set-local-storage-value', () => ({
  __esModule: true,
  default: jest.fn(),
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

  let onEventCallback: Function | undefined;
  let onCallback: Function | undefined;

  return {
    __esModule: true,
    useJoyride: jest.fn((props: { onEvent?: Function }) => {
      onEventCallback = props.onEvent;
      return {
        controls: mockControls,
        on: jest.fn((event: string, handler: Function) => {
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

  it('auto-starts tour on first visit when localStorage flag is not set', () => {
    (getLocalStorageValue as jest.Mock).mockReturnValue(null);

    setup();

    expect(getLocalStorageValue).toHaveBeenCalledWith('guided-tour:test-tour');
    expect(mockJoyride._mockControls.start).toHaveBeenCalled();
  });

  it('does not auto-start when localStorage flag is set', () => {
    (getLocalStorageValue as jest.Mock).mockReturnValue('completed');

    setup();

    expect(mockJoyride._mockControls.start).not.toHaveBeenCalled();
  });

  it('does not auto-start when autoStart is false', () => {
    (getLocalStorageValue as jest.Mock).mockReturnValue(null);

    setup({ autoStart: false });

    expect(mockJoyride._mockControls.start).not.toHaveBeenCalled();
  });

  it('uses tour-specific localStorage key', () => {
    (getLocalStorageValue as jest.Mock).mockReturnValue(null);

    setup({ tourId: 'my-feature-tour' });

    expect(getLocalStorageValue).toHaveBeenCalledWith(
      'guided-tour:my-feature-tour'
    );
  });

  it('marks tour as completed in localStorage on tour end', () => {
    setup({ tourId: 'domain-overview' });

    act(() => {
      mockJoyride._triggerTourEnd?.();
    });

    expect(setLocalStorageValue).toHaveBeenCalledWith(
      'guided-tour:domain-overview',
      'completed'
    );
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
