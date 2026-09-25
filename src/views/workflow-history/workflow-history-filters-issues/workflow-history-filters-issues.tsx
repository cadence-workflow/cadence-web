import { Switch } from 'baseui/switch';
import { RiStethoscopeLine } from 'react-icons/ri';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { type EventGroupIssuesFilterValue } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

import { overrides } from './workflow-history-filters-issues.styles';

export default function WorkflowHistoryFiltersIssues({
  value,
  setValue,
}: PageFilterComponentProps<EventGroupIssuesFilterValue>) {
  return (
    <Switch
      checked={value.historyEventIssues}
      size="small"
      labelPlacement="left"
      onChange={(e) => setValue({ historyEventIssues: e.target.checked })}
      overrides={overrides.switch}
    >
      <RiStethoscopeLine size={16} aria-hidden />
      Only show events with issues
    </Switch>
  );
}
