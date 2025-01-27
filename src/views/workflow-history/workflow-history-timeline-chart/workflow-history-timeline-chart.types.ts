import { type HistoryEventsGroup } from '../workflow-history.types';

export type TimelineChartItem = {
  start: Date;
  end?: Date;
  content: string;
  title?: string;
  type: 'box' | 'point' | 'range' | 'background';
  className: string;
};

export type Props = {
  eventGroups: Array<HistoryEventsGroup>;
  isInitialLoading: boolean;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
