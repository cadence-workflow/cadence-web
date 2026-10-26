'use client';
import React from 'react';

import MarkdocWorkflowPayload from './markdoc-workflow-payload';
import { type TagProps } from './markdoc-workflow-payload.types';

export default function MarkdocWorkflowInput(props: TagProps) {
  return <MarkdocWorkflowPayload kind="input" {...props} />;
}
