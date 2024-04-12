import * as grpcClient from "@/utils/grpc/grpc-client";
import { unstable_cache } from "next/cache";
import { DomainData } from "../domains-page.types";
import CLUSTERS_CONFIGS from "@/config/clusters/clusters-config";

export const getAllDomains =  async () => {
    const results = await Promise.all(CLUSTERS_CONFIGS.map(({ clusterName }) => grpcClient.clusterMethods[clusterName].listDomains({ pageSize: 1000 })))
    const allDomains: Array<DomainData> = []
    results.forEach((res) => {
        allDomains.push(...res.domains)
    })
    return { domains: allDomains }
}

export const getCachedAllDomains = unstable_cache(
    getAllDomains,
    ['cluster-domains'],
    { revalidate: 60 }
);
