import { Modal } from 'baseui/modal';
import { type DefaultValues } from 'react-hook-form';

import ScheduleActionsModalContent from '../schedule-actions-modal-content/schedule-actions-modal-content';

import { overrides } from './schedule-actions-modal.styles';
import { type Props } from './schedule-actions-modal.types';

export default function ScheduleActionsModal<Result, FormData, SubmissionData>({
  action,
  onClose,
  initialFormValues,
  schedule,
  ...scheduleDetailsParams
}: Props<Result, FormData, SubmissionData>) {
  return (
    <Modal
      isOpen={Boolean(action)}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      {action && (
        <ScheduleActionsModalContent
          key={action.id}
          action={action}
          params={{
            ...scheduleDetailsParams,
          }}
          schedule={schedule}
          initialFormValues={
            (initialFormValues ??
              (action.modal.withForm
                ? action.modal.initialFormValues
                : undefined)) as DefaultValues<FormData> | undefined
          }
          onCloseModal={onClose}
        />
      )}
    </Modal>
  );
}
