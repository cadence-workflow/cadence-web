import { renderHook, act } from '@/test-utils/rtl';

import useEventExpansionToggle from '../use-event-expansion-toggle';

describe('useEventExpansionToggle', () => {
  const mockVisibleEvents = [
    { eventId: '1' },
    { eventId: '2' },
    { eventId: '3' },
  ];

  it('should initialize with provided initialState as true (all events expanded)', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: true,
        visibleEvents: mockVisibleEvents,
      })
    );
    expect(result.current.expandedEvents).toBe(true);
  });

  it('should initialize with provided initialState as an object with specific events expanded', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: { '1': true, '2': false },
        visibleEvents: mockVisibleEvents,
      })
    );
    expect(result.current.expandedEvents).toEqual({ '1': true, '2': false });
  });

  it('should toggle all events expansion state', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: { '1': true, '2': false },
        visibleEvents: mockVisibleEvents,
      })
    );

    act(() => {
      result.current.toggleIsExpandAllEvents();
    });
    expect(result.current.expandedEvents).toBe(true);

    act(() => {
      result.current.toggleIsExpandAllEvents();
    });
    expect(result.current.expandedEvents).toEqual({});
  });

  it('should expand a specific event when toggled', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: {},
        visibleEvents: mockVisibleEvents,
      })
    );

    act(() => {
      result.current.toggleIsEventExpanded('1');
    });
    expect(result.current.expandedEvents).toEqual({ '1': true });
  });

  it('should collapse a specific event when toggled if already expanded', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: { '1': true },
        visibleEvents: mockVisibleEvents,
      })
    );

    act(() => {
      result.current.toggleIsEventExpanded('1');
    });
    expect(result.current.expandedEvents).toEqual({});
  });

  it('should collapse only the toggled event when all events are expanded', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: true,
        visibleEvents: mockVisibleEvents,
      })
    );

    act(() => {
      result.current.toggleIsEventExpanded('1');
    });

    expect(result.current.expandedEvents).toEqual({
      '2': true,
      '3': true,
    });
  });

  it('should expand all events when each event has been individually expanded', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: {},
        visibleEvents: mockVisibleEvents,
      })
    );

    act(() => {
      result.current.toggleIsEventExpanded('1');
      result.current.toggleIsEventExpanded('2');
      result.current.toggleIsEventExpanded('3');
    });

    expect(result.current.expandedEvents).toBe(true);
  });

  it('should check if an event is expanded using getIsEventExpanded', () => {
    const { result } = renderHook(() =>
      useEventExpansionToggle({
        initialState: { '1': true, '2': false },
        visibleEvents: mockVisibleEvents,
      })
    );

    expect(result.current.getIsEventExpanded('1')).toBe(true);
    expect(result.current.getIsEventExpanded('2')).toBe(false);
    expect(result.current.getIsEventExpanded('3')).toBe(false);
  });
});
