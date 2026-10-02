'use client';
import React from 'react';

import { Badge } from 'baseui/badge';
import { useParams } from 'next/navigation';

import getRunningBatchActionsCountQuery from '@/route-handlers/list-batch-actions/helpers/get-running-batch-actions-count-query';
import { BATCH_ACTION_BATCHER_DOMAIN } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import useCountWorkflows from '@/views/shared/hooks/use-count-workflows';

import { overrides } from './domain-page-batch-actions-badge.styles';

export default function DomainPageBatchActionsBadge() {
  const { domain, cluster } = useParams<{
    domain: string;
    cluster: string;
  }>();

  const { count } = useCountWorkflows({
    domain: BATCH_ACTION_BATCHER_DOMAIN,
    cluster,
    query: getRunningBatchActionsCountQuery({ domain }),
  });

  if (!count) return null;

  return <Badge content={count} overrides={overrides.badge} />;
}
