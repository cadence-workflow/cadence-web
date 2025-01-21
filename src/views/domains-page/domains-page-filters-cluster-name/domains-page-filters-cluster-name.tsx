'use client';
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import {
  type GetConfigRequestQuery,
  type GetConfigResponse,
} from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

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

  const { data: clusters = [], isLoading } = useQuery<
    GetConfigResponse<'CLUSTERS_PUBLIC'>,
    RequestError,
    GetConfigResponse<'CLUSTERS_PUBLIC'>,
    [string, GetConfigRequestQuery<'CLUSTERS_PUBLIC'>]
  >({
    queryKey: [
      'dynamic_config',
      { configKey: 'CLUSTERS_PUBLIC', jsonArgs: undefined },
    ] as const,
    queryFn: ({ queryKey: [_, { configKey }] }) => {
      return request(`/api/config?configKey=${configKey}`, {
        method: 'GET',
      }).then((res) => res.json());
    },
  });
  const clustersOptions = (clusters as { clusterName: string }[]).map(
    ({ clusterName }) => ({
      label: clusterName,
      id: clusterName,
    })
  );

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
          isLoading={isLoading}
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
