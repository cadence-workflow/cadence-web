import { Tag } from 'baseui/tag';
import { StatefulTooltip } from 'baseui/tooltip';

import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

import { type Props } from './schedule-runs-backfill-cell.types';

export default function ScheduleRunsBackfillCell(props: Props) {
  const isBackfill =
    getSearchAttributeValue(props, 'CadenceScheduleIsBackfill') === true;
  const backfillIdValue = getSearchAttributeValue(
    props,
    'CadenceScheduleBackfillID'
  );
  const backfillId =
    typeof backfillIdValue === 'string' ? backfillIdValue : null;
  const tag = (
    <Tag
      closeable={false}
      hierarchy="secondary"
      kind={isBackfill ? 'positive' : 'neutral'}
    >
      {isBackfill ? 'Yes' : 'No'}
    </Tag>
  );

  if (!isBackfill || !backfillId) {
    return tag;
  }

  return (
    <StatefulTooltip
      accessibilityType="tooltip"
      content={`Backfill Id: ${backfillId}`}
      showArrow
    >
      <span tabIndex={0}>{tag}</span>
    </StatefulTooltip>
  );
}
