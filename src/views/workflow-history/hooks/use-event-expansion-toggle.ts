import { useCallback, useState } from 'react';

import omit from 'lodash/omit';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import {
  type EventExpansionState,
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
  type ToggleIsExpandAllEvents,
} from './use-event-expansion-toggle.types';

export default function useEventExpansionToggle({
  initialState = {},
  visibleEvents,
}: {
  initialState?: EventExpansionState;
  visibleEvents: Pick<HistoryEvent, 'eventId'>[];
}) {
  const [expandedEvents, setExpandedEvents] =
    useState<EventExpansionState>(initialState);

  const isExpandAllEvents = expandedEvents === true;
  const toggleIsExpandAllEvents = useCallback<ToggleIsExpandAllEvents>(() => {
    setExpandedEvents((prev) => {
      if (prev === true) {
        return {};
      }

      return true;
    });
  }, []);

  const getIsEventExpanded = useCallback<GetIsEventExpanded>(
    (eventId: string) => {
      if (expandedEvents === true) {
        return true;
      }

      return Boolean(expandedEvents[eventId]);
    },
    [expandedEvents]
  );

  const toggleIsEventExpanded = useCallback<ToggleIsEventExpanded>(
    (eventId: string) => {
      setExpandedEvents((prev) => {
        let newState: Record<string, boolean>;
        if (prev === true) {
          const retainedExpansion = visibleEvents.reduce(
            (result, { eventId }) => {
              result[eventId] = true;
              return result;
            },
            {} as Record<string, boolean>
          );
          newState = omit(retainedExpansion, eventId);
        } else {
          if (prev[eventId] === true) {
            newState = omit(prev, eventId);
          } else {
            newState = {
              ...prev,
              [eventId]: true,
            };
          }
        }
        if (visibleEvents.every(({ eventId }) => newState[eventId])) {
          return true;
        }
        return newState;
      });
    },
    [visibleEvents]
  );

  return {
    expandedEvents,
    setExpandedEvents,

    isExpandAllEvents,
    toggleIsExpandAllEvents,

    getIsEventExpanded,
    toggleIsEventExpanded,
  };
}
