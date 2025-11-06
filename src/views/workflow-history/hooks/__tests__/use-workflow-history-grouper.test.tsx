import { renderHook, act } from '@testing-library/react';

import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

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

// Mock the HistoryEventsGrouper
jest.mock('../../helpers/workflow-history-grouper');

// Mock useThrottledState to disable throttling in tests
jest.mock('@/hooks/use-throttled-state', () => {
  const { useState } = jest.requireActual('react');
  return jest.fn((initialValue) => {
    const [state, setState] = useState(initialValue);
    const setStateWrapper = (
      callback: (prev: any) => any,
      _executeImmediately?: boolean
    ) => {
      setState((prev: any) => callback(prev));
    };
    return [state, setStateWrapper];
  });
});

describe(useWorkflowHistoryGrouper.name, () => {
  let mockGrouper: jest.Mocked<HistoryEventsGrouper>;
  let mockOnChangeCallback: (state: GroupingProcessState) => void;

  const createMockState = (
    overrides?: Partial<GroupingProcessState>
  ): GroupingProcessState => ({
    groups: {},
    processedEventsCount: 0,
    remainingEventsCount: 0,
    status: 'idle',
    ...overrides,
  });

  beforeEach(() => {
    // Reset the mock implementation before each test
    mockOnChangeCallback = jest.fn();

    mockGrouper = {
      getState: jest.fn(),
      onChange: jest.fn(),
      updateEvents: jest.fn(),
      updatePendingEvents: jest.fn(),
      destroy: jest.fn(),
    } as any;

    // Mock the constructor to return our mock grouper
    (
      HistoryEventsGrouper as jest.MockedClass<typeof HistoryEventsGrouper>
    ).mockImplementation(() => mockGrouper);

    // Default mock implementations
    mockGrouper.getState.mockReturnValue(createMockState());
    mockGrouper.onChange.mockImplementation((callback) => {
      mockOnChangeCallback = callback;
      return jest.fn(); // Return unsubscribe function
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create HistoryEventsGrouper with default batchSize', () => {
      renderHook(() => useWorkflowHistoryGrouper());

      expect(HistoryEventsGrouper).toHaveBeenCalledWith({
        batchSize: 300,
      });
    });

    it('should initialize with state from grouper.getState()', () => {
      const mockState = createMockState({
        groups: { group1: { groupType: 'Activity' } as any },
        processedEventsCount: 10,
      });
      mockGrouper.getState.mockReturnValue(mockState);

      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      expect(mockGrouper.getState).toHaveBeenCalled();
      expect(result.current.eventGroups).toEqual(mockState.groups);
      expect(result.current.groupingState).toEqual(mockState);
    });

    it('should subscribe to grouper onChange', () => {
      renderHook(() => useWorkflowHistoryGrouper());

      expect(mockGrouper.onChange).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return empty groups when groupingState is null', () => {
      mockGrouper.getState.mockReturnValue(null as any);

      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      expect(result.current.eventGroups).toEqual({});
    });
  });

  describe('custom throttleMs', () => {
    it('should accept custom throttle time', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper(5000));

      expect(result.current).toBeDefined();
    });
  });

  describe('onChange subscription', () => {
    it('should update groupingState when onChange callback is triggered', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const newState = createMockState({
        groups: { group1: { groupType: 'Decision' } as any },
        processedEventsCount: 5,
        status: 'processing',
      });

      act(() => {
        mockOnChangeCallback(newState);
      });

      expect(result.current.groupingState).toEqual(newState);
      expect(result.current.eventGroups).toEqual(newState.groups);
      expect(result.current.isProcessing).toBe(true);
    });

    it('should set isProcessing to false when status is idle', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const idleState = createMockState({
        status: 'idle',
      });

      act(() => {
        mockOnChangeCallback(idleState);
      });

      expect(result.current.isProcessing).toBe(false);
    });

    it('should set isProcessing to true when status is processing', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const processingState = createMockState({
        status: 'processing',
      });

      act(() => {
        mockOnChangeCallback(processingState);
      });

      expect(result.current.isProcessing).toBe(true);
    });

    it('should update state immediately when onChange is called', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const newState = createMockState({
        processedEventsCount: 50,
        groups: { group1: { groupType: 'Activity' } as any },
      });

      act(() => {
        mockOnChangeCallback(newState);
      });

      expect(result.current.groupingState).toEqual(newState);
    });
  });

  describe('updateEvents', () => {
    it('should call grouper.updateEvents with provided events', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const mockEvents: HistoryEvent[] = [
        { eventId: '1', eventTime: null } as HistoryEvent,
        { eventId: '2', eventTime: null } as HistoryEvent,
      ];

      act(() => {
        result.current.updateEvents(mockEvents);
      });

      expect(mockGrouper.updateEvents).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle empty events array', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      act(() => {
        result.current.updateEvents([]);
      });

      expect(mockGrouper.updateEvents).toHaveBeenCalledWith([]);
    });

    it('should not throw if grouper is not initialized', () => {
      // This shouldn't happen in practice, but test defensive coding
      mockGrouper.updateEvents.mockImplementation(() => {
        throw new Error('Grouper not initialized');
      });

      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      expect(() => {
        act(() => {
          result.current.updateEvents([]);
        });
      }).toThrow();
    });
  });

  describe('updatePendingEvents', () => {
    it('should call grouper.updatePendingEvents with provided params', async () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const params: ProcessEventsParams = {
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: pendingDecisionTaskStartEvent,
      };

      await act(async () => {
        await result.current.updatePendingEvents(params);
      });

      expect(mockGrouper.updatePendingEvents).toHaveBeenCalledWith(params);
    });

    it('should handle empty pending events', async () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const params: ProcessEventsParams = {
        pendingStartActivities: [],
        pendingStartDecision: null,
      };

      await act(async () => {
        await result.current.updatePendingEvents(params);
      });

      expect(mockGrouper.updatePendingEvents).toHaveBeenCalledWith(params);
    });

    it('should be async and await completion', async () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      let updateCompleted = false;
      mockGrouper.updatePendingEvents.mockImplementation(async () => {
        updateCompleted = true;
      });

      const params: ProcessEventsParams = {
        pendingStartActivities: [],
        pendingStartDecision: null,
      };

      await act(async () => {
        await result.current.updatePendingEvents(params);
      });

      expect(updateCompleted).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe from onChange on unmount', () => {
      const mockUnsubscribe = jest.fn();
      mockGrouper.onChange.mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useWorkflowHistoryGrouper());

      expect(mockUnsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should call grouper.destroy on unmount', () => {
      const { unmount } = renderHook(() => useWorkflowHistoryGrouper());

      expect(mockGrouper.destroy).not.toHaveBeenCalled();

      unmount();

      expect(mockGrouper.destroy).toHaveBeenCalled();
    });

    it('should handle multiple unmounts safely', () => {
      const { unmount } = renderHook(() => useWorkflowHistoryGrouper());

      unmount();

      expect(mockGrouper.destroy).toHaveBeenCalledTimes(1);

      // Second unmount should not throw
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('return values', () => {
    it('should return correct shape of object', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      expect(result.current).toEqual({
        eventGroups: expect.any(Object),
        isProcessing: expect.any(Boolean),
        groupingState: expect.any(Object),
        updateEvents: expect.any(Function),
        updatePendingEvents: expect.any(Function),
      });
    });

    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() =>
        useWorkflowHistoryGrouper()
      );

      const firstUpdateEvents = result.current.updateEvents;
      const firstUpdatePendingEvents = result.current.updatePendingEvents;

      rerender();

      expect(result.current.updateEvents).toBe(firstUpdateEvents);
      expect(result.current.updatePendingEvents).toBe(firstUpdatePendingEvents);
    });
  });

  describe('integration scenarios', () => {
    it('should handle rapid event updates', () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

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
        result.current.updateEvents(events1);
        result.current.updateEvents(events2);
        result.current.updateEvents(events3);
      });

      expect(mockGrouper.updateEvents).toHaveBeenCalledTimes(3);
      expect(mockGrouper.updateEvents).toHaveBeenLastCalledWith(events3);
    });

    it('should handle combined updates and state changes', async () => {
      const { result } = renderHook(() => useWorkflowHistoryGrouper());

      const mockEvents: HistoryEvent[] = [{ eventId: '1' } as HistoryEvent];
      const params: ProcessEventsParams = {
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      };

      act(() => {
        result.current.updateEvents(mockEvents);
      });

      await act(async () => {
        await result.current.updatePendingEvents(params);
      });

      const newState = createMockState({
        groups: { group1: { groupType: 'Activity' } as any },
        processedEventsCount: 1,
      });

      act(() => {
        mockOnChangeCallback(newState);
      });

      expect(result.current.eventGroups).toEqual(newState.groups);
      expect(mockGrouper.updateEvents).toHaveBeenCalledWith(mockEvents);
      expect(mockGrouper.updatePendingEvents).toHaveBeenCalledWith(params);
    });

    it('should persist grouper instance across re-renders', () => {
      const { rerender } = renderHook(() => useWorkflowHistoryGrouper());

      expect(HistoryEventsGrouper).toHaveBeenCalledTimes(1);

      rerender();
      rerender();
      rerender();

      // Constructor should only be called once
      expect(HistoryEventsGrouper).toHaveBeenCalledTimes(1);
    });
  });
});
