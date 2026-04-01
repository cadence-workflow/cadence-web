import { type IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';
import { SYSTEM_SEARCH_ATTRIBUTES } from '@/route-handlers/get-search-attributes/get-search-attributes.constants';
import formatPayload from '@/utils/data-formatters/format-payload';

import workflowsListColumnMatchers from '../config/workflows-list-columns.config';
import { DEFAULT_WORKFLOWS_LIST_COLUMN_WIDTH } from '../workflows-list.constants';
import { type WorkflowsListColumn } from '../workflows-list.types';

export default function getWorkflowsListColumnFromSearchAttribute(
  attributeName: string,
  attributeType: IndexedValueType
): WorkflowsListColumn | null {
  const matcher = workflowsListColumnMatchers.find((m) =>
    m.match(attributeName, attributeType)
  );
  const isSystem = SYSTEM_SEARCH_ATTRIBUTES.has(attributeName);

  if (!matcher && isSystem) return null;

  return {
    id: attributeName,
    name: matcher?.name ?? (isSystem ? attributeName : `*${attributeName}`),
    width: matcher?.width ?? DEFAULT_WORKFLOWS_LIST_COLUMN_WIDTH,
    isDefault: matcher?.isDefault ?? false,
    renderCell: matcher
      ? (row) => matcher.renderCell(row, attributeName)
      : (row) =>
          String(formatPayload(row.searchAttributes?.[attributeName]) ?? ''),
  };
}
