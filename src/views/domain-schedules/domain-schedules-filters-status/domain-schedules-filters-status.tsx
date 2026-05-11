'use client';
import React from 'react';

import ListFilter from '@/components/list-filter/list-filter';
import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { DOMAIN_SCHEDULES_STATUS_LABELS_MAP } from './domain-schedules-filters-status.constants';
import {
  type DomainSchedulesStatus,
  type DomainSchedulesFiltersStatusValue,
} from './domain-schedules-filters-status.types';

export default function DomainSchedulesFiltersStatus({
  value,
  setValue,
}: PageFilterComponentProps<DomainSchedulesFiltersStatusValue>) {
  return (
    <ListFilter<DomainSchedulesStatus>
      label="Status"
      placeholder="All statuses"
      value={value.schedulesStatus}
      onChangeValue={(v) => setValue({ schedulesStatus: v })}
      labelMap={DOMAIN_SCHEDULES_STATUS_LABELS_MAP}
    />
  );
}
