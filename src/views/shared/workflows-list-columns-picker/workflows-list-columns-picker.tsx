import { useCallback, useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { Checkbox } from 'baseui/checkbox';
import { List, arrayMove } from 'baseui/dnd-list';
import { mergeOverrides } from 'baseui/helpers/overrides';
import { Input } from 'baseui/input';
import { Popover } from 'baseui/popover';
import { MdArrowDropDown, MdArrowDropUp, MdTune } from 'react-icons/md';

import { overrides, styled } from './workflows-list-columns-picker.styles';
import {
  type ColumnState,
  type Props,
} from './workflows-list-columns-picker.types';

export default function WorkflowsListColumnsPicker({
  allColumns,
  selectedColumnIds,
  onApply,
  onReset,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<Array<ColumnState>>([]);

  const columnMap = useMemo(
    () => new Map(allColumns.map((c) => [c.id, c])),
    [allColumns]
  );

  const displayedColumns = useMemo(() => {
    if (searchQuery.length === 0) return columns;

    const query = searchQuery.toLowerCase();
    return columns.filter((entry) => {
      const col = columnMap.get(entry.id);
      return col?.name.toLowerCase().includes(query);
    });
  }, [columns, searchQuery, columnMap]);

  const handleButtonClick = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const selectedSet = new Set(selectedColumnIds);
    const allIds = allColumns.map((c) => c.id);
    const unselectedIds = allIds.filter((id) => !selectedSet.has(id));

    setColumns([
      ...selectedColumnIds.map((id) => ({ id, checked: true })),
      ...unselectedIds.map((id) => ({ id, checked: false })),
    ]);
    setSearchQuery('');
    setIsOpen(true);
  };

  const handleToggle = useCallback((columnId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            checked: !column.checked,
          };
        }
        return column;
      })
    );
  }, []);

  const handleReset = useCallback(() => {
    onReset();
    setIsOpen(false);
  }, [onReset]);

  const handleApply = useCallback(() => {
    const orderedSelection = columns
      .filter((entry) => entry.checked)
      .map((entry) => entry.id);

    onApply(orderedSelection);
    setIsOpen(false);
  }, [onApply, columns]);

  const isDragDisabled = searchQuery.length > 0;

  const handleDragEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      if (newIndex === -1 || searchQuery.length > 0) return;

      setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
    },
    [searchQuery.length]
  );

  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={() => setIsOpen(false)}
      placement="bottomRight"
      overrides={overrides.popover}
      content={() => (
        <styled.PopoverContent>
          <styled.SearchContainer>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder="Find Search Attribute"
              size="compact"
              overrides={overrides.searchInput}
              clearable
            />
          </styled.SearchContainer>
          <styled.SubHeader>
            <styled.SubHeaderLabel>*Custom attributes</styled.SubHeaderLabel>
          </styled.SubHeader>
          <styled.ColumnsList>
            <List
              items={displayedColumns.map((entry) => {
                const col = columnMap.get(entry.id);
                return (
                  <styled.ColumnRow key={entry.id}>
                    <styled.ColumnName>
                      {col?.name ?? entry.id}
                    </styled.ColumnName>
                    <styled.CheckboxContainer
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                      onTouchStart={(e: React.TouchEvent) =>
                        e.stopPropagation()
                      }
                    >
                      <Checkbox
                        checked={entry.checked}
                        onChange={() => handleToggle(entry.id)}
                        checkmarkType="toggle"
                      />
                    </styled.CheckboxContainer>
                  </styled.ColumnRow>
                );
              })}
              onChange={handleDragEnd}
              overrides={
                isDragDisabled
                  ? mergeOverrides(
                      overrides.dndList,
                      overrides.dndListDragDisabled
                    )
                  : overrides.dndList
              }
            />
          </styled.ColumnsList>
          <styled.Footer>
            <Button kind="tertiary" size="compact" onClick={handleReset}>
              Reset
            </Button>
            <Button
              kind="primary"
              size="compact"
              onClick={handleApply}
              disabled={columns.every((entry) => !entry.checked)}
            >
              Apply
            </Button>
          </styled.Footer>
        </styled.PopoverContent>
      )}
    >
      <div>
        <Button
          kind="secondary"
          size="compact"
          onClick={handleButtonClick}
          startEnhancer={MdTune}
          endEnhancer={isOpen ? MdArrowDropUp : MdArrowDropDown}
        >
          Columns
        </Button>
      </div>
    </Popover>
  );
}
