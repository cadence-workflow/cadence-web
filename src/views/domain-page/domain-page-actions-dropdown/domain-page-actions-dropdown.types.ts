import type { IconProps } from 'baseui/icon';

export type DomainPageActionConfig = {
  id: string;
  label: string;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
};

export type Props = {
  domain: string;
  cluster: string;
  isBatchActionsEnabled: boolean;
};
