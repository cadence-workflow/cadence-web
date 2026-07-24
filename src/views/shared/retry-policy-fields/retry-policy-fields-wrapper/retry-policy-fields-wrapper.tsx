import { FormControl } from 'baseui/form-control';

import { type Props } from './retry-policy-fields-wrapper.types';

export default function RetryPolicyFieldsWrapper({
  fieldComponent: FieldComponent,
  label,
  description,
  htmlFor,
  error,
  subfield = false,
  children,
}: Props) {
  if (!FieldComponent) {
    return (
      <FormControl label={label} error={error}>
        {children}
      </FormControl>
    );
  }

  return (
    <FieldComponent
      label={label}
      description={description}
      htmlFor={htmlFor}
      error={error}
      subfield={subfield}
    >
      {children}
    </FieldComponent>
  );
}
