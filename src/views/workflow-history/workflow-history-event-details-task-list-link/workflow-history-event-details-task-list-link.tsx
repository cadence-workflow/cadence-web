'use client';
import React from 'react';

import { StyledLink } from 'baseui/link';
import Link from 'next/link';

import { type Props } from './workflow-history-event-details-task-list-link.types';

export default function WorkflowHistoryEventDetailsTaskListLink({
  cluster,
  domain,
  entryValue,
}: Props) {
  return (
    <StyledLink
      $as={Link}
      href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/task-lists/${encodeURIComponent(entryValue.name)}`}
      style={{ fontWeight: 'inherit' }}
    >
      {entryValue.name}
    </StyledLink>
  );
}
