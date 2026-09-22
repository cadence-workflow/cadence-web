import { Switch } from 'baseui/switch';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import useConfigValue from '@/hooks/use-config-value/use-config-value';

import { type EventGroupIssuesFilterValue } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

import { overrides } from './workflow-history-filters-issues.styles';

export default function WorkflowHistoryFiltersIssues({
  value,
  setValue,
}: PageFilterComponentProps<EventGroupIssuesFilterValue>) {
  const { data: isDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  if (!isDiagnosticsInHistoryEnabled) return null;

  return (
    <Switch
      checked={value.historyEventIssues ?? false}
      size="small"
      labelPlacement="left"
      onChange={(e) =>
        setValue({ historyEventIssues: e.target.checked || undefined })
      }
      overrides={overrides.switch}
    >
      Only show events with issues
    </Switch>
  );
}
