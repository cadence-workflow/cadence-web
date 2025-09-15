import { type ButtonProps } from 'baseui/button';

export type Props = ButtonProps & {
  loadingIndicatorType?: 'spinner' | 'skeleton';
};
