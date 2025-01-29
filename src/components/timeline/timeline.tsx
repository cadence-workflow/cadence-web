// @ts-expect-error: react-visjs-timeline does not have type declarations available
import VisJSTimeline from 'react-visjs-timeline';

import { type TimelineItem } from './timeline.types';

export default function Timeline({
  items,
  height = '400px',
}: {
  items: Array<TimelineItem>;
  height?: string;
}) {
  return (
    <VisJSTimeline
      options={{
        height,
        verticalScroll: true,
      }}
      items={items}
    />
  );
}
