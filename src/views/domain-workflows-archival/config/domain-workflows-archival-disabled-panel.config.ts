import { type ArchivalDisabledPanelConfig } from '../domain-workflows-archival-disabled-panel/domain-workflows-archival-disabled-panel.types';

const domainWorkflowsArchivalDisabledPanelConfig = {
  title: 'Archival not enabled for domain',
  details: [
    'This domain currently does not have history archival and/or visibility archival enabled.',
  ],
  links: [
    {
      text: 'Check out the docs',
      href: 'https://cadenceworkflow.io/docs/concepts/archival',
    },
  ],
} as const satisfies ArchivalDisabledPanelConfig;

export default domainWorkflowsArchivalDisabledPanelConfig;
