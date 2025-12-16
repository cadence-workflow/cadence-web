import { useMemo } from 'react';

import { Button } from 'baseui/button';
import { Combobox } from 'baseui/combobox';
import { FormControl } from 'baseui/form-control';
import { Delete } from 'baseui/icon';

import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type ActiveActiveDomain } from '@/views/shared/active-active/active-active.types';

import type domainPageQueryParamsConfig from '../config/domain-page-query-params.config';
import { DEFAULT_CLUSTER_SCOPE } from '../domain-page-failovers/domain-page-failovers.constants';

import { styled, overrides } from './domain-page-failovers-filters.styles';

export default function DomainPageFailoversFilters({
  domainDescription,
  queryParams,
  setQueryParams,
}: {
  domainDescription: ActiveActiveDomain;
  queryParams: PageQueryParamValues<typeof domainPageQueryParamsConfig>;
  setQueryParams: PageQueryParamSetter<typeof domainPageQueryParamsConfig>;
}) {
  const { clusterAttributeScope, clusterAttributeValue } = queryParams;

  const clusterAttributeScopes = useMemo(
    () => [
      DEFAULT_CLUSTER_SCOPE,
      ...Object.keys(
        domainDescription.activeClusters.activeClustersByClusterAttribute
      ),
    ],
    [domainDescription.activeClusters.activeClustersByClusterAttribute]
  );

  const clusterAttributeValuesForScope = useMemo(() => {
    if (
      !clusterAttributeScope ||
      clusterAttributeScope === DEFAULT_CLUSTER_SCOPE
    )
      return [];

    const activeClustersForScope =
      domainDescription.activeClusters.activeClustersByClusterAttribute[
        clusterAttributeScope
      ];

    if (!activeClustersForScope) return [];

    return Object.keys(activeClustersForScope.clusterAttributes);
  }, [
    clusterAttributeScope,
    domainDescription.activeClusters.activeClustersByClusterAttribute,
  ]);

  return (
    <styled.FiltersContainer>
      <styled.FilterContainer>
        <FormControl
          label="Cluster Attribute Scope"
          overrides={overrides.comboboxFormControl}
        >
          <Combobox
            size="compact"
            clearable
            value={clusterAttributeScope ?? ''}
            overrides={{
              Input: {
                props: {
                  placeholder: 'Scope of cluster attribute',
                },
              },
            }}
            onChange={(nextValue) =>
              setQueryParams({
                clusterAttributeScope: nextValue === '' ? undefined : nextValue,
                clusterAttributeValue: undefined,
              })
            }
            options={clusterAttributeScopes.map((scope) => ({
              id: scope,
            }))}
            mapOptionToString={(option) => option.id}
          />
        </FormControl>
      </styled.FilterContainer>
      <styled.FilterContainer>
        <FormControl
          label="Cluster Attribute Value"
          overrides={overrides.comboboxFormControl}
        >
          <Combobox
            size="compact"
            clearable
            disabled={clusterAttributeScope === DEFAULT_CLUSTER_SCOPE}
            value={clusterAttributeValue ?? ''}
            overrides={{
              Input: {
                props: {
                  placeholder: 'Value/name of cluster attribute',
                },
              },
            }}
            onChange={(nextValue) =>
              setQueryParams({
                clusterAttributeValue: nextValue === '' ? undefined : nextValue,
              })
            }
            options={clusterAttributeValuesForScope.map((scope) => ({
              id: scope,
            }))}
            mapOptionToString={(option) => option.id}
          />
        </FormControl>
      </styled.FilterContainer>
      <Button
        size="compact"
        kind="tertiary"
        onClick={() =>
          setQueryParams({
            clusterAttributeScope: undefined,
            clusterAttributeValue: undefined,
          })
        }
        startEnhancer={Delete}
        overrides={overrides.clearFiltersButton}
      >
        Reset filters
      </Button>
    </styled.FiltersContainer>
  );
}
