import { type Ref } from 'react';

import { type DateTimeDisplayFormat } from './date-time-picker.constants';

export type { DateTimeDisplayFormat };

export type Props = {
  value?: string;
  onChange: (next: string | undefined) => void;
  displayFormat?: DateTimeDisplayFormat;
  minDate?: Date;
  maxDate?: Date;
  clearable?: boolean;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  'aria-label'?: string;
  placeholder?: string;
  size?: 'compact' | 'default' | 'large' | 'mini';
  inputRef?: Ref<HTMLInputElement>;
};
