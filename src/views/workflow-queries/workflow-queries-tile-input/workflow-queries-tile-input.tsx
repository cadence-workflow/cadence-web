import React from 'react';

import { Textarea } from 'baseui/textarea';

import { overrides } from './workflow-queries-tile-input.styles';
import { type Props } from './workflow-queries-tile-input.types';

export default function WorkflowQueriesTileInput(props: Props) {
  return (
    <Textarea
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      overrides={overrides.textarea}
    />
  );
}
