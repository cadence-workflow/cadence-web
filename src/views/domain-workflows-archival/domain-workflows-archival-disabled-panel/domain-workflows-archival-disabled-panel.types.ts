export type Props = {
  isHistoryArchivalEnabled: boolean;
  isVisibilityArchivalEnabled: boolean;
};

export type ArchivalDisabledPanelConfig = {
  title: string;
  description: string;
  links: Array<{
    href: string;
    text: string;
  }>;
};
