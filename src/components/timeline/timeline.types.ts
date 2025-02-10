export type TimelineItem = {
  id: number;
  start: Date;
  end?: Date;
  content: string;
  title?: string;
  type: 'box' | 'point' | 'range' | 'background';
  className: string;
};

export type Props = {
  items: Array<TimelineItem>;
  height?: string;
  onClickItem: (itemId: number) => void;
};
