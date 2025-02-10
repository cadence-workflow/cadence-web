// @ts-expect-error: react-visjs-timeline does not have type declarations available
import VisJSTimeline from 'react-visjs-timeline';

import type { Props } from './timeline.types';

export default function Timeline({
  items,
  height = '400px',
  onClickItem,
}: Props) {
  return (
    <VisJSTimeline
      options={{
        height,
        verticalScroll: true,
      }}
      items={items}
      clickHandler={({ item }: { item: number | null }) => {
        if (item !== null) onClickItem(item);
      }}
    />
  );
}
