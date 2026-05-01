import { type Props as ColumnsPickerProps } from '@/views/shared/workflows-list-columns-picker/workflows-list-columns-picker.types';

export type Props = {
  domain: string;
  cluster: string;
  columnsPickerProps?: ColumnsPickerProps;
  timeRangeStart?: string;
  timeRangeEnd: string;
};
