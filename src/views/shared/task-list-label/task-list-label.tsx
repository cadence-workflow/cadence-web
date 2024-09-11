import { Tag, KIND, VARIANT } from 'baseui/tag';

import { styled, overrides } from './task-list-label.styles';
import { type Props } from './task-list-label.types';

export default function TaskListLabel(props: Props) {
  const numWorkers = props.taskList.pollers.length;
  return (
    <styled.LabelContainer $isHighlighted={props.isHighlighted}>
      {props.taskList.name}
      <Tag
        kind={numWorkers === 0 ? KIND.negative : KIND.accent}
        variant={VARIANT.solid}
        closeable={false}
        overrides={overrides.tag}
      >
        {`${numWorkers} ${numWorkers === 1 ? 'worker' : 'workers'}`}
      </Tag>
    </styled.LabelContainer>
  );
}
