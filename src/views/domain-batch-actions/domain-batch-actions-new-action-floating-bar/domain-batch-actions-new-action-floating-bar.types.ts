import { type IconProps } from 'baseui/icon';

export type DomainBatchActionsNewActionFloatingBarActionConfig = {
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
  actions: ReadonlyArray<DomainBatchActionsNewActionFloatingBarActionConfig>;
  onActionClick: (actionId: string) => void;
  disabled?: boolean;
};
