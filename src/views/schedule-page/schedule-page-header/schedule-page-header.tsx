'use client';
import React, { Suspense } from 'react';

import { Breadcrumbs } from 'baseui/breadcrumbs';
import Image from 'next/image';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import Link from '@/components/link/link';
import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import SchedulePageHeaderClusterSelector from '../schedule-page-header-cluster-selector/schedule-page-header-cluster-selector';
import SchedulePageHeaderStatusTag from '../schedule-page-header-status-tag/schedule-page-header-status-tag';

import { cssStyles, overrides } from './schedule-page-header.styles';
import { type Props } from './schedule-page-header.types';

export default function SchedulePageHeader({
  domain,
  cluster,
  scheduleId,
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
          <Link href={domainLink}>{domain}</Link>
          <Suspense fallback={null}>
            <SchedulePageHeaderClusterSelector
              domain={domain}
              cluster={cluster}
            />
          </Suspense>
        </div>
        <div className={cls.breadcrumbItemContainer}>
          {scheduleId}
          <Suspense fallback={null}>
            <SchedulePageHeaderStatusTag
              domain={domain}
              cluster={cluster}
              scheduleId={scheduleId}
            />
          </Suspense>
        </div>
      </Breadcrumbs>
    </PageSection>
  );
}
