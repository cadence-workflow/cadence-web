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
import DomainPageHeaderCount from "./domain-page-header-count";
import { cssStyles, overrides } from "./domains-page-header.styles";
import { Button } from "baseui/button";
import { useMemo, useState } from "react";

type Props = {
  domainsCount: number;
};

export default function DomainPageHeader({ domainsCount }: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(domainPageQueryParamsConfig, { pageRerender: false });
  const { cls, theme } = useStyletronClasses(cssStyles);
  const [showFilters, setShowFilters] = useState(false);
  const selectedFiltersCount = useMemo(() => {
    return 0;
/*     return domainPageQueryParamsConfig
      .reduce((result, { key, defaultValue }) => queryParams[key] === defaultValue ? result : result + 1, 0); */
  }, [queryParams]);
  return (
    <section>
      <Grid>
        <Cell span={12}>
          <div className={cls.titleContainer}>
            <LabelLarge>All domains</LabelLarge>
            <DomainPageHeaderCount count={domainsCount} />
          </div>
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
              <FormControl overrides={overrides.selectFormControl}
                label="Enironments">
                <Select
                  id="id-select-domains-environments"
                  size="compact"
                />
              </FormControl>
            </div>
            <div className={cls.selectFilterContainer}>
              <FormControl overrides={overrides.selectFormControl} label="Clusters">
                <Select
                  id="id-select-domains-clusters"
                  size="compact"
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
