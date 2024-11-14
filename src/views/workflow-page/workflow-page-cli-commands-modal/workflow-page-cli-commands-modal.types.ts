import type workflowPageCliCommandsGroupsConfig from '../config/workflow-page-cli-commands-groups.config';

export type CliCommandGroups =
  (typeof workflowPageCliCommandsGroupsConfig)[number]['name'];

export type CliCommandConfig<G extends string = CliCommandGroups> = {
  label: string;
  description?: string;
  command: string;
  group: G;
};

export type CliCommandGroupConfig<G extends string = string> = {
  name: G;
  title: string;
};

export type CliCommandConfigs<G extends string = CliCommandGroups> =
  CliCommandConfig<G>[];
export type CliCommandGroupConfigs<G extends string = CliCommandGroups> =
  CliCommandGroupConfig<G>[];

export type Props<G extends string = CliCommandGroups> = {
  isOpen: boolean;
  onClose: () => void;
  commands?: CliCommandConfigs<G>;
  commandGroups?: CliCommandGroupConfigs<G>;
};
