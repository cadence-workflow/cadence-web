import ErrorPanel from '@/components/error-panel/error-panel';

import domainWorkflowsArchivalDisabledPanelConfig from '../config/domain-workflows-archival-disabled-panel.config';

export default function DomainWorkflowsArchivalDisabledPanel() {
  return (
    <ErrorPanel
      message={domainWorkflowsArchivalDisabledPanelConfig.title}
      description={domainWorkflowsArchivalDisabledPanelConfig.description}
      actions={domainWorkflowsArchivalDisabledPanelConfig.links.map(
        ({ text, href }) => ({
          kind: 'link-external',
          label: text,
          link: href,
        })
      )}
    />
  );
}
