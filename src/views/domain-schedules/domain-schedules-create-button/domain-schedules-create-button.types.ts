import { type ButtonProps } from 'baseui/button';

export type Props = Pick<
  ButtonProps,
  'kind' | 'size' | 'shape' | 'overrides'
> & {
  domain: string;
  cluster: string;
  onClick: () => void;
};
