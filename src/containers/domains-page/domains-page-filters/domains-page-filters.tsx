"use client"
import { Input } from "baseui/input";
import { LabelLarge } from 'baseui/typography';
import { Cell, Grid } from "baseui/layout-grid";
import { Select } from "baseui/select";
import { FormControl } from 'baseui/form-control';
import domainPageQueryParamsConfig from "../domains-page-query-params";
import usePageQueryParams from "@/hooks/use-page-query-params/use-page-query-params";
import { Delete, Filter, Search, } from "baseui/icon";
import useStyletronClasses from "@/hooks/useStyletronClasses";
import { cssStyles, overrides } from "./domains-page-filters.styles";
import { Button } from "baseui/button";
import { useMemo, useState } from "react";
import CLUSTERS_CONFIGS from "@/configs/clusters/clusters-configs";

export default function DomainPageHeader() {
  const [queryParams, setQueryParams] = usePageQueryParams(domainPageQueryParamsConfig, { pageRerender: false });
  const { cls, theme } = useStyletronClasses(cssStyles);
  const [showFilters, setShowFilters] = useState(false);
  const selectedFiltersCount = useMemo(() => {
    return 0;
    /*     return domainPageQueryParamsConfig
          .reduce((result, { key, defaultValue }) => queryParams[key] === defaultValue ? result : result + 1, 0); */
  }, [/* queryParams */]);

  const clustersOptions = CLUSTERS_CONFIGS.map(({ clusterName }) => ({ label: clusterName, id: clusterName }));
  const clusterValue = clustersOptions.filter(({ id }) => id === queryParams.clusterName)
  return (
    <section>
      <Grid>
        <Cell span={12}>
          <div className={cls.searchBarContainer}>
            <Input
              overrides={overrides.searchInput}
              size="compact"
              clearable
              startEnhancer={() => <Search size={theme.sizing.scale600} />}
              clearOnEscape
              onChange={(event) => {
                const trimmedSearchText = event.target.value.trim()
                setQueryParams({ searchText: trimmedSearchText ? trimmedSearchText : undefined })
              }}
              placeholder="Find cadence domain"
              value={queryParams.searchText}
            />
            <Button startEnhancer={<Filter />} kind={showFilters ? "primary" : "secondary"} size="compact" onClick={() => setShowFilters((v) => !v)}>
              Filters{showFilters || selectedFiltersCount > 0 ? ` (${selectedFiltersCount})` : null}
            </Button>
          </div>
          {showFilters && <div className={cls.filtersContainer}>
            <div className={cls.selectFilterContainer}>
              <FormControl overrides={overrides.selectFormControl} label="Clusters">
                <Select
                  size="compact"
                  value={clusterValue}
                  options={clustersOptions}
                  onChange={(params) => setQueryParams({ clusterName: params.value[0].id })}
                />
              </FormControl>
            </div>
            <div className={cls.clearBtnContainer}>
              <Button startEnhancer={<Delete />} kind="tertiary" size="compact" >
                Clear filters
              </Button>
            </div>
          </div>}
        </Cell>
      </Grid>
    </section>
  );
}
