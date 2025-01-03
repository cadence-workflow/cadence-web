export type Props = {
  isHistoryArchivalEnabled: boolean;
  isVisibilityArchivalEnabled: boolean;
};

export type ArchivalDisabledPanelConfig = {
  title: string;
  details: Array<string>;
  links: Array<{
    href: string;
    text: string;
  }>;
};
