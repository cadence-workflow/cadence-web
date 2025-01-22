// @ts-expect-error react-visjs-timeline does not have types available currently
import Timeline from 'react-visjs-timeline';

import { type HistoryEventsGroup } from '../workflow-history.types';

export default function WorkflowHistoryTimelineChart({
  eventGroups,
}: {
  eventGroups: HistoryEventsGroup[];
}) {
  if (typeof window === 'undefined') return null;

  const timelineItems = eventGroups.map((group) => {});

  return (
    <Timeline
      options={{
        height: '600px',
      }}
      items={eventGroups.map((eventGroup) => {
        const startTimestamp = eventGroup.events[0].eventTime;
        const startTime = new Date(startTimestamp);

        const endTimestamp =
          eventGroup.events[eventGroup.events.length - 1].eventTime;
      })}
      animation={{
        duration: 3000,
        easingFunction: 'easeInQuint',
      }}
    />
  );
}
