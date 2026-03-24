'use client';
import React from 'react';

import { Badge } from 'baseui/badge';

import { overrides } from './domain-page-batch-actions-badge.styles';

export default function DomainPageBatchActionsBadge() {
  // TODO: Replace with actual count from API
  const count = 0;

  if (count === 0) return null;


  return <Badge content={count} overrides={overrides.badge} />;
}
