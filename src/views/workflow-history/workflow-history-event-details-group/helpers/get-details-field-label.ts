import {
  type EventDetailsGroupEntry,
  type EventDetailsSingleEntry,
} from '../../workflow-history-event-details/workflow-history-event-details.types';

export default function getDetailsFieldLabel(
  entry: EventDetailsSingleEntry | EventDetailsGroupEntry,
  parentGroupPath: string = ''
) {
  const defaultLabel =
    parentGroupPath && entry.path.startsWith(parentGroupPath + '.')
      ? entry.path.slice(parentGroupPath.length + 1)
      : entry.path;

  const mainLabel = entry.renderConfig?.getLabel
    ? entry.renderConfig.getLabel({
        key: entry.key,
        path: entry.path,
        value: entry.isGroup ? undefined : entry.value,
      })
    : defaultLabel;

  const groupSuffix = entry.isGroup
    ? ' ' + `(${entry.groupEntries.length})`
    : '';

  return mainLabel + groupSuffix;
}
