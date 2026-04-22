import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { SYSTEM_SEARCH_ATTRIBUTES } from '@/route-handlers/get-search-attributes/get-search-attributes.constants';
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';
import useSearchAttributes from '@/views/shared/hooks/use-search-attributes/use-search-attributes';

import getColumnIdsLocalStorageKey from '../helpers/get-column-ids-local-storage-key';
import getWorkflowsListColumnFromSearchAttribute from '../helpers/get-workflows-list-column-from-search-attribute';
import { DEFAULT_WORKFLOWS_LIST_COLUMNS } from '../workflows-list.constants';
import { type WorkflowsListColumn } from '../workflows-list.types';

export default function useWorkflowsListColumns({
  cluster,
  domain,
}: {
  cluster: string;
  domain: string;
}): {
  availableColumns: Array<WorkflowsListColumn>;
  visibleColumns: Array<WorkflowsListColumn>;
  selectedColumnIds: Array<string>;
  setSelectedColumnIds: Dispatch<SetStateAction<Array<string>>>;
  resetColumns: () => void;
} {
  const localStorageKey = getColumnIdsLocalStorageKey(domain);

  const [columnIds, setColumnIds] = useState<Array<string>>(() => {
    const storedCols = getLocalStorageValue(localStorageKey);
    if (storedCols) {
      try {
        const parsed = JSON.parse(storedCols);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // ignore malformed data, fall through to defaults
      }
    }
    return [...DEFAULT_WORKFLOWS_LIST_COLUMNS];
  });

  const { data: searchAttributesData } = useSearchAttributes({
    cluster,
  });

  const availableColumns = useMemo(() => {
    const keys = searchAttributesData?.keys;
    if (!keys) return [];

    const entries = Object.entries(keys);
    const systemEntries = entries.filter(([name]) =>
      SYSTEM_SEARCH_ATTRIBUTES.has(name)
    );
    const customEntries = entries.filter(
      ([name]) => !SYSTEM_SEARCH_ATTRIBUTES.has(name)
    );

    return systemEntries
      .concat(customEntries)
      .map(([name, type]) =>
        getWorkflowsListColumnFromSearchAttribute(name, type)
      )
      .filter((col): col is WorkflowsListColumn => col !== null);
  }, [searchAttributesData?.keys]);

  const visibleColumns = useMemo(() => {
    const columnById = new Map(availableColumns.map((col) => [col.id, col]));
    return columnIds
      .map((id) => columnById.get(id))
      .filter((col): col is WorkflowsListColumn => col != null);
  }, [availableColumns, columnIds]);

  const setSelectedColumnIds: Dispatch<SetStateAction<Array<string>>> =
    useCallback(
      (action) => {
        setColumnIds((prev) => {
          const next = typeof action === 'function' ? action(prev) : action;
          setLocalStorageValue(localStorageKey, JSON.stringify(next));
          return next;
        });
      },
      [localStorageKey]
    );

  const resetColumns = useCallback(() => {
    setSelectedColumnIds([...DEFAULT_WORKFLOWS_LIST_COLUMNS]);
  }, [setSelectedColumnIds]);

  return {
    availableColumns,
    visibleColumns,
    selectedColumnIds: columnIds,
    setSelectedColumnIds,
    resetColumns,
  };
}
