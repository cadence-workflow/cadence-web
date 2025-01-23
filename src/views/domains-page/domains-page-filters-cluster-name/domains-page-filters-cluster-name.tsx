'use client';
import React, { useContext } from 'react';

import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { DomainsPageContext } from '../domains-page-context-provider/domains-page-context-provider';

import {
  cssStyles,
  overrides,
} from './domains-page-filters-cluster-name.styles';
import { type DomainsPageFiltersClusterNameValue } from './domains-page-filters-cluster-name.types';

function DomainsPageFiltersClusterName({
  value,
  setValue,
}: PageFilterComponentProps<DomainsPageFiltersClusterNameValue>) {
  const { cls } = useStyletronClasses(cssStyles);

  const pageCtx = useContext(DomainsPageContext);
  const { CLUSTERS_PUBLIC } = pageCtx.pageConfig;

  const clustersOptions = CLUSTERS_PUBLIC.map(({ clusterName }) => ({
    label: clusterName,
    id: clusterName,
  }));

  const clusterValue = clustersOptions.filter(
    ({ id }) => id === value.clusterName
  );

  return (
    <div className={cls.selectFilterContainer}>
      <FormControl overrides={overrides.selectFormControl} label="Clusters">
        <Select
          size="compact"
          value={clusterValue}
          options={clustersOptions}
          onChange={(params) =>
            setValue({
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
