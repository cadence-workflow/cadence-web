import type { IconProps } from 'baseui/icon';

export type DomainPageActionButtonProps = {
  domain: string;
  cluster: string;
  label: string;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  onCloseMenu: () => void;
};

export type DomainPageActionConfig = {
  id: string;
  label: DomainPageActionButtonProps['label'];
  icon: DomainPageActionButtonProps['icon'];
  actionButton: React.ComponentType<DomainPageActionButtonProps>;
};

export type Props = {
  domain: string;
  cluster: string;
};
