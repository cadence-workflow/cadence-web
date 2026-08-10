import { MdCancel, MdCellTower, MdPowerSettingsNew } from 'react-icons/md';

import { type DomainBatchActionsNewActionFloatingBarActionConfig } from '../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar.types';

export const cancelBatchAction: DomainBatchActionsNewActionFloatingBarActionConfig =
  {
    id: 'cancel',
    label: 'Cancel',
    icon: MdCancel,
  };

export const terminateBatchAction: DomainBatchActionsNewActionFloatingBarActionConfig =
  {
    id: 'terminate',
    label: 'Terminate',
    icon: MdPowerSettingsNew,
  };

export const signalBatchAction: DomainBatchActionsNewActionFloatingBarActionConfig =
  {
    id: 'signal',
    label: 'Signal',
    icon: MdCellTower,
  };

const domainBatchActionsNewActionFloatingBarConfig = [
  cancelBatchAction,
  terminateBatchAction,
  signalBatchAction,
] as const satisfies DomainBatchActionsNewActionFloatingBarActionConfig[];

export default domainBatchActionsNewActionFloatingBarConfig;
