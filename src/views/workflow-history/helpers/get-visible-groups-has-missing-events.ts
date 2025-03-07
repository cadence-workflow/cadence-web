import type {
  HistoryEventsGroup,
  VisibleHistoryGroupRanges,
} from '../workflow-history.types';

export default function getVisibleGroupsHasMissingEvents(
  groupEntries: Array<[string, Pick<HistoryEventsGroup, 'hasMissingEvents'>]>,
  visibleRanges: VisibleHistoryGroupRanges
): boolean {
  const { startIndex, endIndex, compactStartIndex, compactEndIndex } =
    visibleRanges;
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
