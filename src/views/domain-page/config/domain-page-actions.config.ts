import { MdOutlinePlayArrow, MdPlaylistPlay } from 'react-icons/md';

import DomainPageActionsBatchWorkflow from '../domain-page-actions-batch-workflow/domain-page-actions-batch-workflow';
import { type DomainPageActionConfig } from '../domain-page-actions-dropdown/domain-page-actions-dropdown.types';
import DomainPageActionsStartWorkflow from '../domain-page-actions-start-workflow/domain-page-actions-start-workflow';

const domainPageActionsConfig: Array<DomainPageActionConfig> = [
  {
    id: 'start-workflow',
    label: 'Start new workflow',
    icon: MdOutlinePlayArrow,
    actionButton: DomainPageActionsStartWorkflow,
  },
  {
    id: 'batch-workflow-actions',
    label: 'Batch workflow actions',
    icon: MdPlaylistPlay,
    actionButton: DomainPageActionsBatchWorkflow,
  },
];

export default domainPageActionsConfig;
