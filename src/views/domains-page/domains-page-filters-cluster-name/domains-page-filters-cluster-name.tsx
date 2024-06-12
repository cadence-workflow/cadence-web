'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';

import {
  cssStyles,
  overrides,
} from './domains-page-filters-cluster-name.styles';

const clustersOptions = CLUSTERS_CONFIGS.map(({ clusterName }) => ({
  label: clusterName,
  id: clusterName,
}));

function DomainsPageFiltersClusterName({
  queryParams,
  setQueryParams,
}: PageFilterComponentProps<typeof domainsPageQueryParamsConfig>) {
  const { cls } = useStyletronClasses(cssStyles);

  const clusterValue = clustersOptions.filter(
    ({ id }) => id === queryParams.clusterName
  );

  return (
    <div className={cls.selectFilterContainer}>
      <FormControl overrides={overrides.selectFormControl} label="Clusters">
        <Select
          size="compact"
          value={clusterValue}
          options={clustersOptions}
          onChange={(params) =>
            setQueryParams({
              clusterName:
                typeof params.value[0]?.id === 'undefined'
                  ? undefined
                  : String(params.value[0]?.id),
            })
          }
        />
      </FormControl>
    </div>
  );
}

export default DomainsPageFiltersClusterName;
