import { type IconProps } from 'baseui/icon';

export type DomainNewBatchActionFloatingBarActionConfig = {
  id: string;
  label: string;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
};

export type Props = {
  selectedCount: number;
  totalCount: number;
  actions: ReadonlyArray<DomainNewBatchActionFloatingBarActionConfig>;
  onActionClick: (actionId: string) => void;
};
