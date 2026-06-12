'use client';
import React, { Suspense } from 'react';

import { Breadcrumbs } from 'baseui/breadcrumbs';
import { StyledLink } from 'baseui/link';
import Image from 'next/image';
import Link from 'next/link';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import ScheduleDetailsPageHeaderClusterSelector from '../schedule-details-page-header-cluster-selector/schedule-details-page-header-cluster-selector';
import ScheduleDetailsPageHeaderStatusTag from '../schedule-details-page-header-status-tag/schedule-details-page-header-status-tag';

import { cssStyles, overrides } from './schedule-details-page-header.styles';
import { type Props } from './schedule-details-page-header.types';

export default function ScheduleDetailsPageHeader({
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
          <StyledLink $as={Link} href={domainLink}>
            {domain}
          </StyledLink>
          <Suspense fallback={null}>
            <ScheduleDetailsPageHeaderClusterSelector
              domain={domain}
              cluster={cluster}
            />
          </Suspense>
        </div>
        <div className={cls.breadcrumbItemContainer}>
          {scheduleId}
          <Suspense fallback={null}>
            <ScheduleDetailsPageHeaderStatusTag
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
