import {
  type DomainPageInputTypeQueryParamKey,
  type DomainPageStringQueryParamKey,
} from '@/views/domain-page/config/domain-page-query-params.config';
import { type Props as ColumnsPickerProps } from '@/views/shared/workflows-list-columns-picker/workflows-list-columns-picker.types';

export type Props = {
  domain: string;
  cluster: string;
  columnsPickerProps?: ColumnsPickerProps;
  showQueryInputOnly?: boolean;
  noSpacing?: boolean;
  inputTypeQueryParamKey?: DomainPageInputTypeQueryParamKey;
  queryStringQueryParamKey?: DomainPageStringQueryParamKey;
  timeRangeStart?: string;
  timeRangeEnd?: string;
};
