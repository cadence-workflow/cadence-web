import type { PageQueryParamKeys } from "@/hooks/use-page-query-params/types";
import domainPageQueryParamsConfig from "@/containers/domains-page/domains-page-query-params";


export type DomainPageFilterProps = {
    onChange: (v: string | string[] | undefined) => void,
    value: any,
}

export type DomainPageFilter = {
    id: PageQueryParamKeys<typeof domainPageQueryParamsConfig>;
    renderFilter: React.ComponentType<DomainPageFilterProps> | ((props: DomainPageFilterProps) => React.ReactNode);
};

export type DomainPageFilters = Array<DomainPageFilter>;