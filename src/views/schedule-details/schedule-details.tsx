'use client';
import React from 'react';

import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import scheduleDetailsSectionsConfig from './config/schedule-details-sections.config';
import { getRowsFromConfig } from './helpers/get-rows-from-config';
import ScheduleDetailsBackfillsTable from './schedule-details-backfills-table/schedule-details-backfills-table';
import ScheduleDetailsInputJson from './schedule-details-input-json/schedule-details-input-json';
import ScheduleDetailsPausedBanner from './schedule-details-paused-banner/schedule-details-paused-banner';
import ScheduleDetailsSection from './schedule-details-section/schedule-details-section';
import { styled } from './schedule-details.styles';
import { type Props } from './schedule-details.types';

export default function ScheduleDetails({ params }: Props) {
  const { data, isLoading, isPending } = useDescribeSchedule({
    domain: params.domain,
    cluster: params.cluster,
    scheduleId: params.scheduleId,
    throwOnError: true,
  });

  if (isLoading || isPending) {
    return (
      <>
        <ScheduleDetailsPausedBanner
          domain={params.domain}
          cluster={params.cluster}
          scheduleId={params.scheduleId}
        />
        <SectionLoadingIndicator />
      </>
    );
  }

  // Should never happen as we have throwOnError set to true but it is for better type safety below
  if (!data) {
    throw new Error('Schedule data is unavailable');
  }

  return (
    <PageSection>
      <ScheduleDetailsPausedBanner
        domain={params.domain}
        cluster={params.cluster}
        scheduleId={params.scheduleId}
      />
      <styled.PageContainer>
        <styled.DetailsSectionsContainer>
          {scheduleDetailsSectionsConfig.map((section) => {
            const rows = getRowsFromConfig(
              section.rowsConfig,
              data,
              params.scheduleId
            );
            if (!rows.length) {
              return null;
            }

            return (
              <ScheduleDetailsSection
                key={section.key}
                title={section.title}
                rows={rows}
              />
            );
          })}
          <ScheduleDetailsBackfillsTable
            backfills={data.info?.ongoingBackfills ?? []}
            domain={params.domain}
            cluster={params.cluster}
          />
        </styled.DetailsSectionsContainer>
        <styled.JsonPanel>
          <ScheduleDetailsInputJson input={data.action?.startWorkflow?.input} />
        </styled.JsonPanel>
      </styled.PageContainer>
    </PageSection>
  );
}
