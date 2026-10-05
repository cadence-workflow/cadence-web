import { act, renderHook } from '@/test-utils/rtl';

import useBatchActionSelection from '../use-batch-action-selection';

function setup({ totalCount = 5 }: { totalCount?: number } = {}) {
  return renderHook(() => useBatchActionSelection({ totalCount }));
}

describe(useBatchActionSelection.name, () => {
  it('starts with an empty selection', () => {
    const { result } = setup();

    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isSelected('a')).toBe(false);
  });

  it('toggles individual ids on and off', () => {
    const { result } = setup();

    act(() => result.current.toggleId('a'));
    expect(result.current.isSelected('a')).toBe(true);
    expect(result.current.selectedCount).toBe(1);

    act(() => result.current.toggleId('b'));
    expect(result.current.selectedCount).toBe(2);

    act(() => result.current.toggleId('a'));
    expect(result.current.isSelected('a')).toBe(false);
    expect(result.current.selectedCount).toBe(1);
  });

  it('select all marks every id selected and reports total count', () => {
    const { result } = setup({ totalCount: 5 });

    act(() => result.current.toggleAll());

    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedCount).toBe(5);
    expect(result.current.isSelected('anything')).toBe(true);
  });

  it('ignores individual toggles while select all is active', () => {
    const { result } = setup({ totalCount: 5 });

    act(() => result.current.toggleAll());
    act(() => result.current.toggleId('a'));

    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.isSelected('a')).toBe(true);
  });

  it('turning select all off clears the selection', () => {
    const { result } = setup({ totalCount: 5 });

    act(() => result.current.toggleAll());
    act(() => result.current.toggleAll());

    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it('reset clears both select-all and individual selection', () => {
    const { result } = setup();

    act(() => result.current.toggleId('a'));
    act(() => result.current.reset());
    expect(result.current.selectedCount).toBe(0);

    act(() => result.current.toggleAll());
    act(() => result.current.reset());
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });
});
