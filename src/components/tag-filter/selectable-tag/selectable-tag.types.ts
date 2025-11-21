import { type TagProps } from 'baseui/tag';

export type Props = Partial<TagProps> & {
  value: boolean;
  onClick: () => void;
};
