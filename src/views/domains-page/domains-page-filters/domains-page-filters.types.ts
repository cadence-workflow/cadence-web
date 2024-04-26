import type {
  PageQueryParamKeys,
  PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import domainsPageQueryParamsConfig from '@/views/domains-page/config/domains-page-query-params.config';
import { DomainData } from '../domains-page.types';

export type DomainsPageFilterProps<InputType = any, OutputType = any> = {
  value: InputType;
  onChange: (v: OutputType) => void;
};

export type DomainsPageFilterConfig = {
  id: PageQueryParamKeys<typeof domainsPageQueryParamsConfig>;
  filterFunc: (
    d: DomainData,
    queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>
  ) => boolean;
  renderFilter:
    | React.ComponentType<DomainsPageFilterProps>
    | ((props: DomainsPageFilterProps) => React.ReactNode);
};

export type DomainsPageFiltersConfig = Array<DomainsPageFilterConfig>;
