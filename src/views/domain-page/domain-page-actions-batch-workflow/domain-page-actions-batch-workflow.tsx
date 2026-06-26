import { useRouter } from 'next/navigation';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';

import domainPageQueryParamsConfig from '../config/domain-page-query-params.config';
import { type DomainPageActionButtonProps } from '../domain-page-actions-dropdown/domain-page-actions-dropdown.types';
import DomainPageBaseActionButton from '../domain-page-base-action-button/domain-page-base-action-button';

export default function DomainPageActionsBatchWorkflow({
  domain,
  cluster,
  label,
  icon,
  onCloseMenu,
}: DomainPageActionButtonProps) {
  const router = useRouter();
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const {
    data: isBatchActionsEnabled,
    isError,
    isLoading,
  } = useConfigValue('BATCH_ACTIONS_ENABLED', { domain, cluster });

  if (!isBatchActionsEnabled) return null;

  return (
    <DomainPageBaseActionButton
      label={label}
      icon={icon}
      disabledReason={isError || isLoading ? 'Action Unavailable' : undefined}
      onClick={() => {
        const params = new URLSearchParams(window.location.search);
        params.set('batch-query', queryParams.query ?? '');
        params.set('bid', 'draft');
        router.push(`batch-actions?${params.toString()}`);
        onCloseMenu();
      }}
    />
  );
}
