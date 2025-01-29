export type TimelineItem = {
  start: Date;
  end?: Date;
  content: string;
  title?: string;
  type: 'box' | 'point' | 'range' | 'background';
  className: string;
};
