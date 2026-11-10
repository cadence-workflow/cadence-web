import {
  type NavigationBarEventsMenuItem,
  type NavigationBarEventsSubMenuItem,
} from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';
import {
  type EventGroupEntry,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

import getDiagnosticsIssueExpansionId from './get-diagnostics-issue-expansion-id';
import getEventGroupCategory from './get-event-group-category';
import getEventKey from './get-event-key';

export default function getNavigationBarDiagnosticsMenuItems(
  eventGroupsEntries: Array<EventGroupEntry>,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): Array<NavigationBarEventsMenuItem> {
  return eventGroupsEntries.reduce<Array<NavigationBarEventsMenuItem>>(
    (acc, [_, group]) => {
      let firstEventKeyWithIssues: string | undefined;
      const subItems: Array<NavigationBarEventsSubMenuItem> = [];

      for (const event of group.events) {
        const eventKey = getEventKey(event);
        const issues = diagnosticsIssuesByEventId[eventKey];
        if (!issues || issues.length === 0) continue;

        firstEventKeyWithIssues ??= eventKey;

        for (const issue of issues) {
          subItems.push({
            id: getDiagnosticsIssueExpansionId(issue),
            eventKey,
            label: issue.invariantType,
          });
        }
      }

      if (!firstEventKeyWithIssues) return acc;

      acc.push({
        eventKey: firstEventKeyWithIssues,
        label: group.shortLabel ?? group.label,
        category: getEventGroupCategory(group),
        subItems,
      });

      return acc;
    },
    []
  );
}
