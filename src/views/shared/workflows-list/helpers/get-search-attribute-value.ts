import formatPayload from '@/utils/data-formatters/format-payload';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

export default function getSearchAttributeValue(
  row: DomainWorkflow,
  attributeName: string
): unknown {
  return formatPayload(row.searchAttributes?.[attributeName]);
}
