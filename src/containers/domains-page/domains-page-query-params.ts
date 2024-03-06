import { PageQueryParamConfig } from "@/hooks/use-page-query-params/types"

const domainPageQueryParamsConfig: PageQueryParamConfig[] = [{
    key: "searchText",
    queryParamKey: "s",
    defaultValue: ""
},
{
    key: "sortColumn",
    queryParamKey: "sc",
},
{
    key: "sortOrder",
    queryParamKey: "so",
}]

export default domainPageQueryParamsConfig;