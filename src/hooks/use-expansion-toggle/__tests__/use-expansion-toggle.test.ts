import { renderHook, act } from '@/test-utils/rtl';

import useExpansionToggle from '../use-expansion-toggle';

describe('useExpansionToggle', () => {
  const mockItems = ['1', '2', '3'];

  it('should initialize with provided initialState as true (all items expanded)', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: true,
        items: mockItems,
      })
    );
    expect(result.current.expandedItems).toBe(true);
  });

  it('should initialize with provided initialState as an object with specific items expanded', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: { '1': true, '2': false },
        items: mockItems,
      })
    );
    expect(result.current.expandedItems).toEqual({ '1': true, '2': false });
  });

  it('should toggle all items expansion state', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: { '1': true, '2': false },
        items: mockItems,
      })
    );

    act(() => {
      result.current.toggleAreAllItemsExpanded();
    });
    expect(result.current.expandedItems).toBe(true);

    act(() => {
      result.current.toggleAreAllItemsExpanded();
    });
    expect(result.current.expandedItems).toEqual({});
  });

  it('should expand a specific item when toggled', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: {},
        items: mockItems,
      })
    );

    act(() => {
      result.current.toggleIsItemExpanded('1');
    });
    expect(result.current.expandedItems).toEqual({ '1': true });
  });

  it('should collapse a specific item when toggled if already expanded', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: { '1': true },
        items: mockItems,
      })
    );

    act(() => {
      result.current.toggleIsItemExpanded('1');
    });
    expect(result.current.expandedItems).toEqual({});
  });

  it('should collapse only the toggled item when all items are expanded', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: true,
        items: mockItems,
      })
    );

    act(() => {
      result.current.toggleIsItemExpanded('1');
    });

    expect(result.current.expandedItems).toEqual({
      '2': true,
      '3': true,
    });
  });

  it('should expand all items when each item has been individually expanded', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: {},
        items: mockItems,
      })
    );

    act(() => {
      result.current.toggleIsItemExpanded('1');
      result.current.toggleIsItemExpanded('2');
      result.current.toggleIsItemExpanded('3');
    });

    expect(result.current.expandedItems).toBe(true);
  });

  it('should check if an item is expanded using getIsItemExpanded', () => {
    const { result } = renderHook(() =>
      useExpansionToggle({
        initialState: { '1': true, '2': false },
        items: mockItems,
      })
    );

    expect(result.current.getIsItemExpanded('1')).toBe(true);
    expect(result.current.getIsItemExpanded('2')).toBe(false);
    expect(result.current.getIsItemExpanded('3')).toBe(false);
  });
});
