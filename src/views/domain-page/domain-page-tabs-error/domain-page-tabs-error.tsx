import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';

import domainPageTabsConfig from '../config/domain-page-tabs.config';
import { type DomainPageContentParams } from '../domain-page-content/domain-page-content.types';

import { type Props } from './domain-page-tabs-error.types';

export default function DomainPageTabsError({ error, reset }: Props) {
  const { domainTab } = useParams<DomainPageContentParams>();
  const tabConfig = domainPageTabsConfig[domainTab];

  if (!tabConfig) {
    return (
      <PanelSection>
        <ErrorPanel
          error={error}
          message={'Failed to load domain content'}
          reset={reset}
        />
      </PanelSection>
    );
  }

  const errorConfig = tabConfig.getErrorConfig(error);

  return (
    <PanelSection>
      <ErrorPanel
        error={error}
        message={errorConfig.message}
        actions={errorConfig.actions}
        omitLogging={errorConfig.omitLogging}
        reset={reset}
      />
    </PanelSection>
  );
}
