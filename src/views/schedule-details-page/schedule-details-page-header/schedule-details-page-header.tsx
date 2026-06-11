'use client';
import React from 'react';

import { Breadcrumbs } from 'baseui/breadcrumbs';
import { StyledLink } from 'baseui/link';
import Image from 'next/image';
import Link from 'next/link';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type DomainPageTabName } from '@/views/domain-page/domain-page-tabs/domain-page-tabs.types';

import { cssStyles, overrides } from './schedule-details-page-header.styles';
import { type Props } from './schedule-details-page-header.types';

export default function ScheduleDetailsPageHeader({
  domain,
  cluster,
  scheduleId,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const domainLink = `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}`;
  const schedulesListLink = `${domainLink}/${'schedules' satisfies DomainPageTabName}`;

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
        <StyledLink $as={Link} href={schedulesListLink}>
          Schedules
        </StyledLink>
        <div>{scheduleId}</div>
      </Breadcrumbs>
    </PageSection>
  );
}
