'use client';
import React from 'react';

import { Badge } from 'baseui/badge';
import { Skeleton } from 'baseui/skeleton';

import { overrides } from './domains-page-title-badge.styles';
import type { Props } from './domains-page-title-badge.types';
import getDomainsCountLabel from './helpers/get-domains-count-label';

export default function DomainsPageTitleBadge({
  count,
  totalCount,
  isLoading,
  hasNextPage,
}: Props) {
  if (isLoading) {
    return <Skeleton overrides={overrides.skeleton} animation />;
  }

  return (
    <Badge
      content={getDomainsCountLabel({ count, totalCount, hasNextPage })}
      overrides={overrides.badge}
    />
  );
}
