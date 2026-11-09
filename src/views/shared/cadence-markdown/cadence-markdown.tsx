'use client';
import React from 'react';

import Markdown from '@/components/markdown/markdown';

import {
  CADENCE_MARKDOC_COMPONENTS,
  CADENCE_MARKDOC_TAGS,
} from './cadence-markdown.constants';
import { type Props } from './cadence-markdown.types';

export default function CadenceMarkdown(props: Props) {
  return (
    <Markdown
      markdown={props.markdown}
      domain={props.domain}
      cluster={props.cluster}
      workflowId={props.workflowId}
      runId={props.runId}
      onActionSuccess={props.onActionSuccess}
      extraTags={CADENCE_MARKDOC_TAGS}
      extraComponents={CADENCE_MARKDOC_COMPONENTS}
    />
  );
}
