import { type DomainPageActionButtonProps } from '../domain-page-actions-dropdown/domain-page-actions-dropdown.types';

export type Props = {
  label: DomainPageActionButtonProps['label'];
  icon: DomainPageActionButtonProps['icon'];
  disabledReason?: string;
  onClick: () => void;
};
