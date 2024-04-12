import { PageQueryParam } from "@/hooks/use-page-query-params/types"

const domainPageQueryParamsConfig:
    [
        PageQueryParam<"searchText", string>,
        PageQueryParam<"clusterName", string>,
        PageQueryParam<"sortColumn", string>,
        PageQueryParam<"sortOrder", string>
    ]
    = [{
        key: "searchText",
        queryParamKey: "s",
        defaultValue: ""
    },
    {
        key: "clusterName",
        queryParamKey: "c",
        defaultValue: ""
    },
    {
        key: "sortColumn",
        queryParamKey: "sc",
    },
    {
        key: "sortOrder",
        queryParamKey: "so",
    }] as const;

export default domainPageQueryParamsConfig;