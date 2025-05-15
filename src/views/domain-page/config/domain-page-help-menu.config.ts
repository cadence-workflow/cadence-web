import { FaSlack } from 'react-icons/fa';
import { MdArticle, MdTerminal } from 'react-icons/md';

import WorkflowPageCliCommandsModal from '@/views/workflow-page/workflow-page-cli-commands-modal/workflow-page-cli-commands-modal';

import { type DomainPageHelpMenuConfig } from '../domain-page-help/domain-page-help.types';

const domainPageHelpMenuConfig = [
  {
    title: 'Getting started',
    items: [
      {
        kind: 'link',
        text: 'Get started (docs)',
        icon: MdArticle,
        href: 'https://cadenceworkflow.io/docs/get-started',
      },
    ],
  },
  {
    title: 'CLI Commands',
    items: [
      {
        kind: 'modal',
        text: 'Domain commands',
        icon: MdTerminal,
        modal: WorkflowPageCliCommandsModal,
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        kind: 'link',
        text: 'Cadence Docs',
        icon: MdArticle,
        href: 'https://cadenceworkflow.io/docs/concepts',
      },
      {
        kind: 'link',
        text: 'Cadence on Slack',
        icon: FaSlack,
        href: 'http://t.uber.com/cadence-slack',
      },
    ],
  },
] as const satisfies DomainPageHelpMenuConfig;

export default domainPageHelpMenuConfig;
