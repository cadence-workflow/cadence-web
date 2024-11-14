import { type CliCommandGroupConfig } from '../workflow-page-cli-commands-modal/workflow-page-cli-commands-modal.types';

const workflowPageCliCommandsGroupsConfig = [
  {
    name: 'domain',
    title: 'Domain',
  },
  {
    name: 'workflow',
    title: 'Workflow',
  },
] as const satisfies CliCommandGroupConfig[];

export default workflowPageCliCommandsGroupsConfig;
