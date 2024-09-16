import { useStyletron } from 'baseui';
import { MdCheckCircleOutline, MdRadioButtonUnchecked } from 'react-icons/md';

import { styled } from './task-list-workers-table-handler-icon.styles';

export default function TaskListWorkersTableHandlerIcon(props: {
  hasHandler: boolean;
}) {
  const [_, theme] = useStyletron();
  const Icon = props.hasHandler ? MdCheckCircleOutline : MdRadioButtonUnchecked;

  return (
    <styled.IconContainer $hasHandler={props.hasHandler}>
      <Icon size={theme.sizing.scale800} display="block" />
    </styled.IconContainer>
  );
}
