import { MdAdd } from 'react-icons/md';

import ErrorPanel from '@/components/error-panel/error-panel';

import { styled } from './domain-batch-actions-no-actions-placeholder.styles';
import { type Props } from './domain-batch-actions-no-actions-placeholder.types';

export default function DomainBatchActionsNoActionsPlaceholder({
  onCreateNew,
}: Props) {
  return (
    <styled.Container data-tour="batch-new-action-button">
      <ErrorPanel
        message="No batch actions found"
        description="Click the button below to get started with Batch Workflow actions. Easily process multiple tasks at once and automate your workflows with just a few simple steps."
        actions={[
          {
            kind: 'callback',
            label: 'New batch action',
            buttonKind: 'primary',
            startEnhancer: MdAdd,
            onClick: onCreateNew,
          },
        ]}
      />
    </styled.Container>
  );
}
