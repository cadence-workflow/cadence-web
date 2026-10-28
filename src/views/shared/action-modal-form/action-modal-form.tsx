import { type FieldValues } from 'react-hook-form';

import ActionModalFormWithValidation from './action-modal-form-with-validation';
import { type Props } from './action-modal-form.types';

export default function ActionModalForm<FormData extends FieldValues>({
  schema,
  initialFormValues,
  onSubmit,
  onConfirm,
  children,
}: Props<FormData>) {
  if (schema) {
    return (
      <ActionModalFormWithValidation
        schema={schema}
        initialFormValues={initialFormValues}
        onSubmit={onSubmit}
      >
        {children}
      </ActionModalFormWithValidation>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onConfirm();
      }}
    >
      {children()}
    </form>
  );
}
