import { renderHook, act } from '@testing-library/react';

import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../__fixtures__/workflow-history-pending-events';
import HistoryEventsGrouper from '../../helpers/workflow-history-grouper';
import type {
  GroupingProcessState,
  ProcessEventsParams,
} from '../../helpers/workflow-history-grouper.types';
import useWorkflowHistoryGrouper from '../use-workflow-history-grouper';

jest.mock('../../helpers/workflow-history-grouper');

jest.mock('../use-workflow-history-grouper.constants', () => ({
  BATCH_SIZE: 100,
}));

describe(useWorkflowHistoryGrouper.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create HistoryEventsGrouper with default batchSize', () => {
    setup();

    expect(HistoryEventsGrouper).toHaveBeenCalledWith({
      batchSize: 100, // called with the mocked BATCH_SIZE
    });
  });

  it('should initialize with state from grouper.getState()', () => {
    const {
      result: { current },
      mockGrouperInstance,
    } = setup({
      initialState: {
        groups: {
          group1: mockActivityEventGroup,
        },
        processedEventsCount: 10,
      },
    });

    expect(mockGrouperInstance.getState).toHaveBeenCalled();
    expect(current.eventGroups).toEqual({
      group1: mockActivityEventGroup,
    });
    expect(current.groupingState).toMatchObject({
      groups: {
        group1: mockActivityEventGroup,
      },
      processedEventsCount: 10,
    });
  });

  it('should subscribe to grouper onChange', () => {
    const { mockGrouperInstance } = setup();

    expect(mockGrouperInstance.onChange).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should update groupingState when onChange callback is triggered', () => {
    const { result, getMockOnChangeCallback } = setup();

    const newState = createMockState({
      groups: {
        group1: mockDecisionEventGroup,
      },
      processedEventsCount: 5,
      status: 'processing',
    });

    act(() => {
      const mockOnChangeCallback = getMockOnChangeCallback();
      mockOnChangeCallback(newState);
    });

    expect(result.current.groupingState).toEqual(newState);
    expect(result.current.eventGroups).toEqual(newState.groups);
    expect(result.current.isProcessing).toBe(true);
  });

  it('should set isProcessing to false when status is idle', () => {
    const { result, getMockOnChangeCallback } = setup();

    const idleState = createMockState({
      status: 'idle',
    });

    act(() => {
      const mockOnChangeCallback = getMockOnChangeCallback();
      mockOnChangeCallback(idleState);
    });

    expect(result.current.isProcessing).toBe(false);
  });

  it('should set isProcessing to true when status is processing', () => {
    const { result, getMockOnChangeCallback } = setup();

    const processingState = createMockState({
      status: 'processing',
    });

    act(() => {
      const mockOnChangeCallback = getMockOnChangeCallback();
      mockOnChangeCallback(processingState);
    });

    expect(result.current.isProcessing).toBe(true);
  });

  it('should call grouper.updateEvents with provided events', () => {
    const {
      result: { current },
      mockGrouperInstance,
    } = setup();

    const mockEvents: HistoryEvent[] = [
      { eventId: '1', eventTime: null } as HistoryEvent,
      { eventId: '2', eventTime: null } as HistoryEvent,
    ];

    act(() => {
      current.updateEvents(mockEvents);
    });

    expect(mockGrouperInstance.updateEvents).toHaveBeenCalledWith(mockEvents);
  });

  it('should call grouper.updatePendingEvents with provided params', async () => {
    const {
      result: { current },
      mockGrouperInstance,
    } = setup();

    const params: ProcessEventsParams = {
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: pendingDecisionTaskStartEvent,
    };

    act(() => {
      current.updatePendingEvents(params);
    });

    expect(mockGrouperInstance.updatePendingEvents).toHaveBeenCalledWith(
      params
    );
  });

  it('should unsubscribe from onChange on unmount', () => {
    const { unmount, mockUnsubscribe } = setup();

    expect(mockUnsubscribe).not.toHaveBeenCalled();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should call grouper.destroy on unmount', () => {
    const { unmount, mockGrouperInstance } = setup();

    expect(mockGrouperInstance.destroy).not.toHaveBeenCalled();

    unmount();

    expect(mockGrouperInstance.destroy).toHaveBeenCalled();
  });

  it('should handle rapid event updates', () => {
    const {
      result: { current },
      mockGrouperInstance,
    } = setup();

    const events1: HistoryEvent[] = [{ eventId: '1' } as HistoryEvent];
    const events2: HistoryEvent[] = [
      { eventId: '1' } as HistoryEvent,
      { eventId: '2' } as HistoryEvent,
    ];
    const events3: HistoryEvent[] = [
      { eventId: '1' } as HistoryEvent,
      { eventId: '2' } as HistoryEvent,
      { eventId: '3' } as HistoryEvent,
    ];

    act(() => {
      current.updateEvents(events1);
      current.updateEvents(events2);
      current.updateEvents(events3);
    });

    expect(mockGrouperInstance.updateEvents).toHaveBeenCalledTimes(3);
    expect(mockGrouperInstance.updateEvents).toHaveBeenLastCalledWith(events3);
  });

  it('should persist grouper instance across re-renders', () => {
    const { rerender } = setup();

    expect(HistoryEventsGrouper).toHaveBeenCalledTimes(1);

    rerender();
    rerender();
    rerender();

    // Constructor should only be called once
    expect(HistoryEventsGrouper).toHaveBeenCalledTimes(1);
  });
});

const createMockState = (
  overrides?: Partial<GroupingProcessState>
): GroupingProcessState => ({
  groups: {},
  processedEventsCount: 0,
  remainingEventsCount: 0,
  status: 'idle',
  ...overrides,
});

function setup(options?: {
  initialState?: Partial<GroupingProcessState>;
  throttleMs?: number;
}) {
  let mockOnChangeCallback: (state: GroupingProcessState) => void;
  const mockUnsubscribe = jest.fn();

  const initialState = createMockState(options?.initialState);

  // Spy on the prototype methods to create type-safe mocks
  const getStateSpy = jest
    .spyOn(HistoryEventsGrouper.prototype, 'getState')
    .mockReturnValue(initialState);

  const onChangeSpy = jest
    .spyOn(HistoryEventsGrouper.prototype, 'onChange')
    .mockImplementation((callback) => {
      mockOnChangeCallback = callback;
      return mockUnsubscribe;
    });

  const updateEventsSpy = jest.spyOn(
    HistoryEventsGrouper.prototype,
    'updateEvents'
  );

  const updatePendingEventsSpy = jest.spyOn(
    HistoryEventsGrouper.prototype,
    'updatePendingEvents'
  );

  const destroySpy = jest.spyOn(HistoryEventsGrouper.prototype, 'destroy');

  // Render the hook (constructor will create instance with spied methods)
  const hookResult = renderHook(() =>
    useWorkflowHistoryGrouper(options?.throttleMs ?? 0)
  );

  return {
    ...hookResult,
    mockGrouperInstance: {
      getState: getStateSpy,
      onChange: onChangeSpy,
      updateEvents: updateEventsSpy,
      updatePendingEvents: updatePendingEventsSpy,
      destroy: destroySpy,
    },
    getMockOnChangeCallback: () => mockOnChangeCallback,
    mockUnsubscribe,
  };
}
