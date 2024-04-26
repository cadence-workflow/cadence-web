import type {
  PageQueryParamKeys,
  PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import domainPageQueryParamsConfig from '@/views/domains-page/config/domains-page-query-params.config';
import { DomainData } from '../domains-page.types';

export type DomainPageFilterProps<InputType = any, OutputType = any> = {
  value: InputType;
  onChange: (v: OutputType) => void;
};

export type DomainPageFilter = {
  id: PageQueryParamKeys<typeof domainPageQueryParamsConfig>;
  filterFunc: (
    d: DomainData,
    queryParams: PageQueryParamValues<typeof domainPageQueryParamsConfig>
  ) => boolean;
  renderFilter:
    | React.ComponentType<DomainPageFilterProps>
    | ((props: DomainPageFilterProps) => React.ReactNode);
};

export type DomainPageFilters = Array<DomainPageFilter>;
