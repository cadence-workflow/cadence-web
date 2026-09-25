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

export default function getNavigationBarDiagnosticsMenuItems(
  eventGroupsEntries: Array<EventGroupEntry>,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): Array<NavigationBarEventsMenuItem> {
  return eventGroupsEntries.reduce<Array<NavigationBarEventsMenuItem>>(
    (acc, [_, group]) => {
      let firstEventIdWithIssues: string | undefined;
      const subItems: Array<NavigationBarEventsSubMenuItem> = [];

      for (const event of group.events) {
        const eventId = event.eventId ?? event.computedEventId;
        const issues = diagnosticsIssuesByEventId[eventId];
        if (!issues || issues.length === 0) continue;

        firstEventIdWithIssues ??= eventId;

        for (const issue of issues) {
          subItems.push({
            id: getDiagnosticsIssueExpansionId(issue),
            eventId,
            label: issue.invariantType,
          });
        }
      }

      if (!firstEventIdWithIssues) return acc;

      acc.push({
        eventId: firstEventIdWithIssues,
        label: group.shortLabel ?? group.label,
        category: getEventGroupCategory(group),
        subItems,
      });

      return acc;
    },
    []
  );
}
