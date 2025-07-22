import { Segment, SegmentedControl } from 'baseui/segmented-control';
import { MdCode, MdSort } from 'react-icons/md';

import { overrides } from './workflow-diagnostics-view-toggle.styles';
import { type Props } from './workflow-diagnostics-view-toggle.types';

export default function WorkflowDiagnosticsViewToggle(props: Props) {
  return (
    <SegmentedControl
      {...(props.listEnabled
        ? {
            activeKey: props.activeView,
            onChange: ({ activeKey }) =>
              props.setActiveView(activeKey === 'list' ? 'list' : 'json'),
          }
        : {
            activeKey: 'json',
          })}
      overrides={overrides.viewToggle}
    >
      <Segment
        key="list"
        artwork={() => <MdSort />}
        label="List"
        disabled={!props.listEnabled}
        overrides={overrides.viewToggleSegment}
      />
      <Segment
        key="json"
        artwork={() => <MdCode />}
        label="JSON"
        overrides={overrides.viewToggleSegment}
      />
    </SegmentedControl>
  );
}
