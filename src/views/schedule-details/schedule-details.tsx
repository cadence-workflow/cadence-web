'use client';
import React from 'react';

import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import scheduleDetailsSectionsConfig from './config/schedule-details-sections.config';
import { formatScheduleDetails } from './helpers/format-schedule-details';
import { getRowsFromConfig } from './helpers/get-rows-from-config';
import ScheduleDetailsBackfillsTable from './schedule-details-backfills-table/schedule-details-backfills-table';
import ScheduleDetailsJsonView from './schedule-details-json-view/schedule-details-json-view';
import ScheduleDetailsPausedBanner from './schedule-details-paused-banner/schedule-details-paused-banner';
import ScheduleDetailsSection from './schedule-details-section/schedule-details-section';
import { styled } from './schedule-details.styles';
import { type Props } from './schedule-details.types';
import decodeUrlParams from '@/utils/decode-url-params';
import { SchedulePageTabsParams } from '../schedule-page/schedule-page-tabs/schedule-page-tabs.types';

export default function ScheduleDetails({ params }: Props) {
  const decodedParams = decodeUrlParams(params) as SchedulePageTabsParams;

  const { data, isLoading, isPending } = useDescribeSchedule({
    domain: decodedParams.domain,
    cluster: decodedParams.cluster,
    scheduleId: decodedParams.scheduleId,
    throwOnError: true,
  });

  if (isLoading || isPending) {
    return <SectionLoadingIndicator />;
  }

  // Should never happen as we have throwOnError set to true but it is for better type safety below
  if (!data) {
    throw new Error('Schedule data is unavailable');
  }

  const formattedScheduleDetails = formatScheduleDetails(data);

  return (
    <PageSection>
      <ScheduleDetailsPausedBanner
        paused={formattedScheduleDetails.state?.paused ?? false}
        pauseInfo={formattedScheduleDetails.state?.pauseInfo ?? null}
      />
      <styled.PageContainer>
        <styled.DetailsSectionsContainer>
          {scheduleDetailsSectionsConfig.map((section) => {
            const rows = getRowsFromConfig(
              section.rowsConfig,
              formattedScheduleDetails,
              decodedParams.scheduleId,
              decodedParams.domain,
              params.cluster
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
            backfills={formattedScheduleDetails.info?.ongoingBackfills ?? []}
            domain={decodedParams.domain}
            cluster={decodedParams.cluster}
          />
        </styled.DetailsSectionsContainer>
        <styled.JsonPanel>
          <ScheduleDetailsJsonView
            title="Input"
            json={formattedScheduleDetails.action?.startWorkflow?.input ?? null}
          />
        </styled.JsonPanel>
      </styled.PageContainer>
    </PageSection>
  );
}
