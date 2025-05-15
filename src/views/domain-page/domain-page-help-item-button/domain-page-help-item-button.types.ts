import { type IconProps } from 'baseui/icon';

interface DomainPageHelpBaseItem {
  kind: 'link' | 'modal' | 'other';
  text: string;
  icon: React.ComponentType<{
    size: IconProps['size'];
    color: IconProps['color'];
  }>;
}

interface DomainPageHelpLinkItem extends DomainPageHelpBaseItem {
  kind: 'link';
  href: string;
}

interface DomainPageHelpModalItem extends DomainPageHelpBaseItem {
  kind: 'modal';
  modal: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
  }>;
}

interface DomainPageHelpOtherItem extends DomainPageHelpBaseItem {
  kind: 'other';
  onClick: () => void;
}

export type DomainPageHelpItem =
  | DomainPageHelpLinkItem
  | DomainPageHelpModalItem
  | DomainPageHelpOtherItem;
