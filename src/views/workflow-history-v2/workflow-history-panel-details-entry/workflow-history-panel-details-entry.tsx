import { type Props } from './workflow-history-panel-details-entry.types';

export default function WorkflowHistoryPanelDetailsEntry({
  entryKey,
  entryPath,
  entryValue,
  renderConfig,
  isNegative,
  ...decodedPageUrlParams
}: Props) {
  const ValueComponent = renderConfig?.valueComponent;

  if (ValueComponent !== undefined) {
    return (
      <ValueComponent
        entryKey={entryKey}
        entryPath={entryPath}
        entryValue={entryValue}
        isNegative={isNegative}
        {...decodedPageUrlParams}
      />
    );
  }

  return String(entryValue);
}
