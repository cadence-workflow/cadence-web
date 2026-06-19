'use client';
import React from 'react';

import PageSection from '@/components/page-section/page-section';
import { type ReadOnlyDetailsTableRow } from '@/components/read-only-details-table/read-only-details-table.types';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import { type ScheduleDetailRowConfig } from '../schedule-page/config/schedule-detail-sections.types';
import scheduleDetailsSectionsConfig from '../schedule-page/config/schedule-details-sections.config';
import SchedulePageDetailsSection from '../schedule-page/schedule-page-details-section/schedule-page-details-section';

import { cssStyles } from './schedule-details.styles';
import { type Props } from './schedule-details.types';

export default function ScheduleDetails({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const { data, isLoading, isPending } = useDescribeSchedule({
    domain: params.domain,
    cluster: params.cluster,
    scheduleId: params.scheduleId,
    throwOnError: true,
  });

  if (isLoading || isPending) {
    return <SectionLoadingIndicator />;
  }

  // Should never happen as we have throwOnError set to true but it is for better type safety below
  if (!data) {
    throw new Error('Schedule data is unavailable');
  }

  return (
    <PageSection>
      <div className={cls.detailsSectionsContainer}>
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
            <SchedulePageDetailsSection
              key={section.key}
              title={section.title}
              rows={rows}
            />
          );
        })}
      </div>
    </PageSection>
  );
}

function getRowsFromConfig(
  config: ScheduleDetailRowConfig[],
  data: NonNullable<ReturnType<typeof useDescribeSchedule>['data']>,
  scheduleId: string
): ReadOnlyDetailsTableRow[] {
  const args = { describeSchedule: data, scheduleId };
  return config
    .filter(
      (rowConfig) =>
        !rowConfig.hide || !rowConfig.hide({ describeSchedule: data, scheduleId })
    )
    .map((rowConfig) => ({
      key: rowConfig.key,
      label: rowConfig.getLabel(),
      value: rowConfig.getValue(args),
    }));
}
