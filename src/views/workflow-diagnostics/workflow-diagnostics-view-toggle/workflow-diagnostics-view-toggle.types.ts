export type DiagnosticsViewMode = 'list' | 'json';

export type ListEnabledProps = {
  listEnabled: true;
  activeView: DiagnosticsViewMode;
  setActiveView: (view: DiagnosticsViewMode) => void;
};

export type ListDisabledProps = {
  listEnabled: false;
};

export type Props = ListEnabledProps | ListDisabledProps;
