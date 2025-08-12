import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

export default function useArchivalInputType(): {
  forceQueryInputOnly: boolean;
  inputType: WorkflowsHeaderInputType;
} {
  const { data: archivalDefaultSearchEnabled } = useSuspenseConfigValue(
    'ARCHIVAL_DEFAULT_SEARCH_ENABLED'
  );

  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  return {
    forceQueryInputOnly: !archivalDefaultSearchEnabled,
    inputType: archivalDefaultSearchEnabled
      ? queryParams.inputTypeArchival
      : 'query',
  };
}
