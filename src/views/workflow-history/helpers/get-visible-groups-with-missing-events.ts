import type {
  HistoryEventsGroup,
  VisibleHistoryGroupRanges,
} from '../workflow-history.types';

export default function getVisibleGroupsWithMissingEvents(
  groupEntries: Array<[string, Pick<HistoryEventsGroup, 'hasMissingEvents'>]>,
  visibileRanges: VisibleHistoryGroupRanges
): boolean {
  const { startIndex, endIndex, compactStartIndex, compactEndIndex } =
    visibileRanges;
  const visibleHasMissing = groupEntries
    .slice(startIndex, endIndex + 1)
    .some(([_, { hasMissingEvents }]) => hasMissingEvents);

  if (visibleHasMissing) return true;
  const compactVisibleHasMissing = groupEntries
    .slice(compactStartIndex, compactEndIndex + 1)
    .some(([_, { hasMissingEvents }]) => hasMissingEvents);

  if (compactVisibleHasMissing) return true;
  return false;
}
