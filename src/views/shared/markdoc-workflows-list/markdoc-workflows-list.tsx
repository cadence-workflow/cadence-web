'use client';
import React, { useContext } from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

import MarkdocWorkflowsListContent from './markdoc-workflows-list-content';
import { type Props } from './markdoc-workflows-list.types';

export default function MarkdocWorkflowsList({
  query,
  columns,
  domain: domainProp,
  cluster: clusterProp,
}: Props) {
  const markdownContext = useContext(MarkdownContext);
  const domain = domainProp ?? markdownContext.domain;
  const cluster = clusterProp ?? markdownContext.cluster;

  if (!query || !domain || !cluster) {
    return (
      <ErrorPanel
        message="Workflows list needs a query, domain and cluster"
        omitLogging
      />
    );
  }

  return (
    <MarkdocWorkflowsListContent
      query={query}
      columns={columns}
      domain={domain}
      cluster={cluster}
    />
  );
}
