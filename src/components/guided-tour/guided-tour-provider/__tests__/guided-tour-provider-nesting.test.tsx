import { useContext } from 'react';

import { render, screen, act } from '@/test-utils/rtl';

import GuidedTourProvider, {
  GuidedTourContext,
  useGuidedTour,
} from '../guided-tour-provider';
import * as storage from '../guided-tour-storage';

jest.mock('../guided-tour-storage', () => ({
  __esModule: true,
  isTourCompleted: jest.fn(),
  markTourCompleted: jest.fn(),
}));

jest.mock('react-joyride', () => {
  type Instance = {
    tourId: string;
    controls: {
      start: jest.Mock;
      stop: jest.Mock;
      next: jest.Mock;
      prev: jest.Mock;
      skip: jest.Mock;
      close: jest.Mock;
      go: jest.Mock;
      open: jest.Mock;
      reset: jest.Mock;
      info: jest.Mock;
    };
    onCallbacks: Record<string, ((...args: unknown[]) => void) | undefined>;
  };

  const instances: Instance[] = [];
  let nextStepsLookup: Array<{ tourId: string }> = [];

  function makeControls() {
    return {
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
  }

  return {
    __esModule: true,
    useJoyride: jest.fn(
      (_props: {
        steps: Array<{ content: string }>;
        onEvent?: (...args: unknown[]) => void;
      }) => {
        const tourId = nextStepsLookup.shift()?.tourId ?? 'unknown';
        const instance: Instance = {
          tourId,
          controls: makeControls(),
          onCallbacks: {},
        };
        instances.push(instance);

        return {
          controls: instance.controls,
          on: jest.fn(
            (event: string, handler: (...args: unknown[]) => void) => {
              instance.onCallbacks[event] = handler;
              return jest.fn();
            }
          ),
          Tour: <div data-testid={`joyride-tour-${tourId}`} />,
          state: {},
          step: null,
          failures: [],
        };
      }
    ),
    ORIGIN: { OVERLAY: 'overlay' },
    get _instances() {
      return instances;
    },
    _resetInstances() {
      instances.length = 0;
    },
    _registerNext(tourIds: string[]) {
      nextStepsLookup = tourIds.map((tourId) => ({ tourId }));
    },
  };
});

const mockJoyride = jest.requireMock('react-joyride');

const outerSteps = [{ target: 'body', content: 'outer' }];
const innerSteps = [{ target: 'body', content: 'inner' }];

beforeEach(() => {
  jest.clearAllMocks();
  mockJoyride._resetInstances();
});

describe('GuidedTourProvider — nesting', () => {
  function ProbeContext() {
    const ctx = useContext(GuidedTourContext);
    return (
      <div data-testid="ctx-controls">
        {ctx?.controls === mockJoyride._instances[1]?.controls
          ? 'inner'
          : ctx?.controls === mockJoyride._instances[0]?.controls
            ? 'outer'
            : 'none'}
      </div>
    );
  }

  function ProbeHook() {
    const { controls } = useGuidedTour();
    return (
      <div data-testid="hook-controls">
        {controls === mockJoyride._instances[1]?.controls
          ? 'inner'
          : controls === mockJoyride._instances[0]?.controls
            ? 'outer'
            : 'none'}
      </div>
    );
  }

  it('runs both useJoyride instances independently and renders both Tour outlets', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(false);
    mockJoyride._registerNext(['outer', 'inner']);

    render(
      <GuidedTourProvider tourId="outer" steps={outerSteps}>
        <GuidedTourProvider tourId="inner" steps={innerSteps}>
          <div>child</div>
        </GuidedTourProvider>
      </GuidedTourProvider>
    );

    expect(mockJoyride._instances).toHaveLength(2);
    expect(screen.getByTestId('joyride-tour-outer')).toBeInTheDocument();
    expect(screen.getByTestId('joyride-tour-inner')).toBeInTheDocument();

    expect(storage.isTourCompleted).toHaveBeenCalledWith('outer');
    expect(storage.isTourCompleted).toHaveBeenCalledWith('inner');
    expect(mockJoyride._instances[0].controls.start).toHaveBeenCalled();
    expect(mockJoyride._instances[1].controls.start).toHaveBeenCalled();
  });

  it('exposes only the innermost provider via context (shadowing)', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(true);
    mockJoyride._registerNext(['outer', 'inner']);

    render(
      <GuidedTourProvider tourId="outer" steps={outerSteps}>
        <GuidedTourProvider tourId="inner" steps={innerSteps}>
          <ProbeContext />
          <ProbeHook />
        </GuidedTourProvider>
      </GuidedTourProvider>
    );

    expect(screen.getByTestId('ctx-controls')).toHaveTextContent('inner');
    expect(screen.getByTestId('hook-controls')).toHaveTextContent('inner');
  });

  it('a child rendered between providers can reach the outer controls', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(true);
    mockJoyride._registerNext(['outer', 'inner']);

    render(
      <GuidedTourProvider tourId="outer" steps={outerSteps}>
        <ProbeHook />
        <GuidedTourProvider tourId="inner" steps={innerSteps}>
          <div>child</div>
        </GuidedTourProvider>
      </GuidedTourProvider>
    );

    expect(screen.getByTestId('hook-controls')).toHaveTextContent('outer');
  });

  it('marks each tour completion under its own id', () => {
    (storage.isTourCompleted as jest.Mock).mockReturnValue(false);
    mockJoyride._registerNext(['outer', 'inner']);

    render(
      <GuidedTourProvider tourId="outer" steps={outerSteps}>
        <GuidedTourProvider tourId="inner" steps={innerSteps}>
          <div>child</div>
        </GuidedTourProvider>
      </GuidedTourProvider>
    );

    act(() => {
      mockJoyride._instances[1].onCallbacks['tour:end']?.();
      mockJoyride._instances[0].onCallbacks['tour:end']?.();
    });

    expect(storage.markTourCompleted).toHaveBeenCalledWith('outer');
    expect(storage.markTourCompleted).toHaveBeenCalledWith('inner');
  });
});
