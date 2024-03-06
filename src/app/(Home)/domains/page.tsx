import DomainPage from "@/containers/domains-page/domains-page";
import type { DomainData } from "@/containers/domains-page/domains-page.types";
import grpcClient from "@/utils/grpc-client";
import { unstable_cache } from "next/cache";

const getCachedDomains = unstable_cache(
  async () => grpcClient.listDomains({}),
  ['cluster-domains'],
  { revalidate: 60 }
);

export default async function Domains() {
  const { domains } = await getCachedDomains() as { domains: Array<DomainData> }
  return (
    <DomainPage domains={domains} />
  );
}