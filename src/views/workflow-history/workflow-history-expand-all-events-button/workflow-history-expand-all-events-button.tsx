import { Button } from 'baseui/button';
import { MdUnfoldLess, MdUnfoldMore } from 'react-icons/md';

import { type Props } from './workflow-history-expand-all-events-button.types';

export default function WorkflowHistoryExpandAllEventsButton({
  isExpandAllEvents,
  toggleIsExpandAllEvents,
}: Props) {
  return (
    <Button
      $size="compact"
      kind="secondary"
      startEnhancer={() =>
        isExpandAllEvents ? (
          <MdUnfoldLess size={16} />
        ) : (
          <MdUnfoldMore size={16} />
        )
      }
      onClick={() => {
        toggleIsExpandAllEvents();
      }}
    >
      {isExpandAllEvents ? 'Collapse all' : 'Expand all'}
    </Button>
  );
}
