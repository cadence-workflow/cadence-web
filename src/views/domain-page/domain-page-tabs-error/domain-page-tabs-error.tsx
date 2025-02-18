import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';

import domainPageTabsErrorConfig from '../config/domain-page-tabs-error.config';
import { type DomainTabName } from '../domain-page-content/domain-page-content.types';

import { type Props } from './domain-page-tabs-error.types';

export default function DomainPageTabsError({ error, reset }: Props) {
  const { domainTab } = useParams();
  const getConfig = domainPageTabsErrorConfig[domainTab as DomainTabName];

  if (typeof getConfig !== 'function') {
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

  const errorConfig = getConfig(error);
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
