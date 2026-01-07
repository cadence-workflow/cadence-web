import { type ButtonProps } from 'baseui/button';

export type ViewToggleTooltipContentConfig = {
  content: Array<string>;
  linkButtons?: Array<{
    label: string;
    href: string;
    startEnhancer: ButtonProps['startEnhancer'];
  }>;
};

export type Props = {
  kind: 'primary' | 'secondary';
  label: string;
  onClick: () => void;
  tooltipContent: ViewToggleTooltipContentConfig;
};
