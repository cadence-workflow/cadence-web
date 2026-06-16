'use client';
import React from 'react';

import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { MdAdd } from 'react-icons/md';

import PageFilters from '@/components/page-filters/page-filters';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainSchedulesFiltersConfig from '../config/domain-schedules-filters.config';

import { styled } from './domain-schedules-header.styles';
import { type Props } from './domain-schedules-header.types';

export default function DomainSchedulesHeader({
  count,
  onCreateScheduleClick,
}: Props) {
  const title = count === undefined ? 'Schedules' : `Schedules (${count})`;

  return (
    <styled.Container>
      <styled.TitleRow>
        <styled.Title>{title}</styled.Title>
      </styled.TitleRow>
      <styled.FiltersToolbar>
        <styled.FiltersSlot>
          <PageFilters
            searchQueryParamKey="schedulesSearch"
            searchPlaceholder="Find schedule by ID or workflow type"
            pageFiltersConfig={domainSchedulesFiltersConfig}
            pageQueryParamsConfig={domainPageQueryParamsConfig}
          />
        </styled.FiltersSlot>
        <styled.CreateButtonWrap>
          <Button
            kind={KIND.primary}
            size={SIZE.compact}
            shape={SHAPE.default}
            startEnhancer={<MdAdd size={18} aria-hidden />}
            onClick={onCreateScheduleClick}
          >
            Create schedule
          </Button>
        </styled.CreateButtonWrap>
      </styled.FiltersToolbar>
    </styled.Container>
  );
}
