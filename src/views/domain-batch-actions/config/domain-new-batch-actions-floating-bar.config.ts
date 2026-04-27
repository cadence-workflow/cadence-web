import { MdCancel, MdCellTower, MdPowerSettingsNew } from 'react-icons/md';

import { type DomainNewBatchActionFloatingBarActionConfig } from '../domain-new-batch-actions-floating-bar/domain-new-batch-actions-floating-bar.types';

export const cancelBatchAction: DomainNewBatchActionFloatingBarActionConfig = {
  id: 'cancel',
  label: 'Cancel',
  icon: MdCancel,
};

export const terminateBatchAction: DomainNewBatchActionFloatingBarActionConfig =
  {
    id: 'terminate',
    label: 'Terminate',
    icon: MdPowerSettingsNew,
  };

export const signalBatchAction: DomainNewBatchActionFloatingBarActionConfig = {
  id: 'signal',
  label: 'Signal',
  icon: MdCellTower,
};

const domainNewBatchActionFloatingBarConfig = [
  cancelBatchAction,
  terminateBatchAction,
  signalBatchAction,
] as const satisfies DomainNewBatchActionFloatingBarActionConfig[];

export default domainNewBatchActionFloatingBarConfig;
