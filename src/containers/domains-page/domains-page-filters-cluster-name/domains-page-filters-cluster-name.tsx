'use client';
import React from 'react';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import {
  cssStyles,
  overrides,
} from './domains-page-filters-cluster-name.styles';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';
import { DomainPageFilterProps } from '../domains-page-filters/domains-page-filters.types';

const clustersOptions = CLUSTERS_CONFIGS.map(({ clusterName }) => ({
  label: clusterName,
  id: clusterName,
}));

function DomainsPageFiltersClusterName({
  onChange,
  value,
}: DomainPageFilterProps) {
  const { cls } = useStyletronClasses(cssStyles);

  const clusterValue = clustersOptions.filter(({ id }) => id === value);

  return (
    <div className={cls.selectFilterContainer}>
      <FormControl overrides={overrides.selectFormControl} label="Clusters">
        <Select
          size="compact"
          value={clusterValue}
          options={clustersOptions}
          onChange={(params) =>
            onChange(
              typeof params.value[0]?.id === 'undefined'
                ? undefined
                : String(params.value[0]?.id)
            )
          }
        />
      </FormControl>
    </div>
  );
}

export default DomainsPageFiltersClusterName;
