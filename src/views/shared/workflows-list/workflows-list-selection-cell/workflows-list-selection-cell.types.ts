import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

import { type SelectionParams } from '../workflows-list.types';

export type Props = {
  selection: SelectionParams;
  workflow: DomainWorkflow;
};
