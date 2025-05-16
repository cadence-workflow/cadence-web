import { createElement } from 'react';

import { type DomainPageHelpMenuConfig } from '../domain-page-help/domain-page-help.types';

export const mockDomainPageHelpMenuConfig = [
  {
    title: 'Documentation',
    items: [
      {
        kind: 'link',
        text: 'Get started (docs)',
        icon: () => createElement('span', {}, 'Docs Icon'),
        href: 'https://mock.docs.link',
      },
    ],
  },
  {
    title: 'Commands',
    items: [
      {
        kind: 'modal',
        text: 'Domain commands',
        icon: () => createElement('span', {}, 'Cmds Icon'),
        modal: ({ isOpen }) =>
          createElement('div', {}, isOpen ? 'Open modal' : 'Closed modal'),
      },
    ],
  },
  {
    title: 'Actions',
    items: [
      {
        kind: 'other',
        text: 'Custom action',
        icon: () => createElement('span', {}, 'Other Icon'),
        onClick: jest.fn(),
      },
    ],
  },
] as const satisfies DomainPageHelpMenuConfig;
