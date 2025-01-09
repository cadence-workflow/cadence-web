import { StatefulMenu } from 'baseui/menu';

export default function WorkflowPageActionsMenu() {
  return (
    <StatefulMenu
      // placeholder
      items={[
        {
          label: 'Item One',
        },
        {
          label: 'Item Two',
        },
        {
          label: 'Item Three',
        },
        {
          label: 'Item Four',
        },
      ]}
    />
  );
}
