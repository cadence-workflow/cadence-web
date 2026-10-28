import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, useForm } from 'react-hook-form';

import { type ValidatedProps } from './action-modal-form.types';

export default function ActionModalFormWithValidation<
  FormData extends FieldValues,
>({ schema, initialFormValues, onSubmit, children }: ValidatedProps<FormData>) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialFormValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  return <form onSubmit={form.handleSubmit(onSubmit)}>{children(form)}</form>;
}
