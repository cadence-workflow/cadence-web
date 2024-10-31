'use client';
import React from 'react';

import { Breadcrumbs } from 'baseui/breadcrumbs';
import { StyledLink } from 'baseui/link';
import Image from 'next/image';
import Link from 'next/link';
import queryString from 'query-string';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import ErrorBoundary from '@/components/error-boundary/error-boundary';
import PageSection from '@/components/page-section/page-section';
import { type PageQueryParamSetterValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import type domainPageTabsConfig from '@/views/domain-page/config/domain-page-tabs.config';

import WorkflowPageStatusTag from '../workflow-page-status-tag/workflow-page-status-tag';

import { cssStyles, overrides } from './workflow-page-header.styles';
import type { Props } from './workflow-page-header.types';

export default function WorkflowPageHeader({
  domain,
  workflowId,
  runId,
  cluster,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const domainLink = `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}`;
  return (
    <PageSection>
      <Breadcrumbs
        overrides={overrides.breadcrumbs}
        showTrailingSeparator={false}
      >
        <div className={cls.breadcrumbItemContainer}>
          <Image
            width={22}
            height={22}
            alt="Cadence Icon"
            src={cadenceLogoBlack}
          />
          <StyledLink $as={Link} href={domainLink}>
            {domain}
          </StyledLink>
        </div>
        <StyledLink
          $as={Link}
          href={queryString.stringifyUrl({
            url:
              domainLink +
              '/' +
              // ensuring that this tab exists in config
              ('workflows' satisfies (typeof domainPageTabsConfig)[number]['key']),
            // ensuring that these query params exist in config
            query: {
              search: workflowId,
            } satisfies Partial<
              PageQueryParamSetterValues<typeof domainPageQueryParamsConfig>
            >,
          })}
        >
          {workflowId}
        </StyledLink>
        <div className={cls.breadcrumbItemContainer}>
          {runId}
          <ErrorBoundary fallbackRender={() => null} omitLogging={true}>
            <WorkflowPageStatusTag />
          </ErrorBoundary>
        </div>
      </Breadcrumbs>
    </PageSection>
  );
}
