import { Suspense } from "react";
import DomainPageHeader from "./domains-page-header/domains-page-header";
import type { DomainData } from "./domains-page.types";
import DomainsTable from "./domains-table/domains-table";


export default function Domains({ domains }: { domains: Array<DomainData> }) {
    return (
        <Suspense>
            <DomainPageHeader domainsCount={domains.length} />
            <DomainsTable domains={domains} />
        </Suspense>
    );
}
