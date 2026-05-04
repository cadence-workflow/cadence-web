import { type Control, type FieldErrors } from 'react-hook-form';

import { type BatchActionParamsFormData } from './schemas/batch-action-params-schema';

export type Props = {
  control: Control<BatchActionParamsFormData>;
  fieldErrors: FieldErrors<BatchActionParamsFormData>;
};
