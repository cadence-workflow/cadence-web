import { type IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';
import { SYSTEM_SEARCH_ATTRIBUTES } from '@/route-handlers/get-search-attributes/get-search-attributes.constants';
import formatPayload from '@/utils/data-formatters/format-payload';

import workflowsListColumnsConfig from '../config/workflows-list-columns.config';
import { DEFAULT_WORKFLOWS_LIST_COLUMN_WIDTH } from '../workflows-list.constants';
import { type WorkflowsListColumn } from '../workflows-list.types';

export default function getWorkflowsListColumnFromSearchAttribute(
  attributeName: string,
  attributeType: IndexedValueType
): WorkflowsListColumn | null {
  const config = workflowsListColumnsConfig.find((m) =>
    m.match(attributeName, attributeType)
  );

  const isSystem = SYSTEM_SEARCH_ATTRIBUTES.has(attributeName);

  if (isSystem && !config) return null;

  return {
    id: attributeName,
    name: config?.name ?? attributeName,
    width: config?.width ?? DEFAULT_WORKFLOWS_LIST_COLUMN_WIDTH,
    isSystem,
    renderCell: config
      ? (row) => config.renderCell(row, attributeName)
      : (row) =>
          String(formatPayload(row.searchAttributes?.[attributeName]) ?? ''),
  };
}
