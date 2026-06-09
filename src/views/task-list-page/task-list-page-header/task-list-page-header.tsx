'use client';
import React, { Suspense } from 'react';

import { Breadcrumbs } from 'baseui/breadcrumbs';
import { StyledLink } from 'baseui/link';
import Image from 'next/image';
import Link from 'next/link';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import TaskListLabel from '@/views/shared/task-list-label/task-list-label';

import TaskListPageHeaderClusterSelector from '../task-list-page-header-cluster-selector/task-list-page-header-cluster-selector';

import { cssStyles, overrides } from './task-list-page-header.styles';
import type { Props } from './task-list-page-header.types';

export default function TaskListPageHeader({
  domain,
  cluster,
  taskList,
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
          <Suspense fallback={null}>
            <TaskListPageHeaderClusterSelector
              domain={domain}
              cluster={cluster}
            />
          </Suspense>
        </div>
        <div className={cls.breadcrumbItemContainer}>
          <TaskListLabel taskList={taskList} isHighlighted />
        </div>
      </Breadcrumbs>
    </PageSection>
  );
}
