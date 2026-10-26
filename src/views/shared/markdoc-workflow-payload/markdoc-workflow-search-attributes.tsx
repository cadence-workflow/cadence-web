'use client';
import React from 'react';

import MarkdocWorkflowPayload from './markdoc-workflow-payload';
import { type SearchAttributesTagProps } from './markdoc-workflow-payload.types';

export default function MarkdocWorkflowSearchAttributes(
  props: SearchAttributesTagProps
) {
  return <MarkdocWorkflowPayload kind="searchAttributes" {...props} />;
}
