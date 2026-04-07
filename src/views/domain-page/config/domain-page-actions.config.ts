import { MdOutlinePlayArrow, MdPlaylistPlay } from 'react-icons/md';

import type { DomainPageActionConfig } from '../domain-page-actions-dropdown/domain-page-actions-dropdown.types';

export const startWorkflowDomainAction: DomainPageActionConfig = {
  id: 'start-workflow',
  label: 'Start new workflow',
  icon: MdOutlinePlayArrow,
};

export const batchWorkflowDomainAction: DomainPageActionConfig = {
  id: 'batch-workflow-actions',
  label: 'Batch workflow actions',
  icon: MdPlaylistPlay,
};

const domainPageActionsConfig = [
  startWorkflowDomainAction,
  batchWorkflowDomainAction,
] as const satisfies DomainPageActionConfig[];

export default domainPageActionsConfig;
