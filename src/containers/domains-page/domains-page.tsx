import React, { JSXElementConstructor, Suspense } from "react";
import DomainPageHeader from "./domains-page-filters/domains-page-filters";
import DomainsTable from "./domains-table/domains-table";
import { getCachedDomains } from "./domains-page.utils";
import DomainPageTitle from "./domains-page-title/domains-page-title";
import DomainsPageTitleBadge from "./domains-page-title-badge/domains-page-title-badge";
import SectionLoadingIndicator from "@/components/section-loading-indicator/section-loading-indicator";


async function RSCWithAsyncProps<Component extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, ComponentProps extends React.ComponentProps<Component>>({ component, getAsyncProps }: { component: Component, getAsyncProps: () => Promise<ComponentProps> }) {
    const asyncProps = await getAsyncProps();
    const Component = component;
    return (
        <Component {...asyncProps} />
    )
}

export default async function Domains() {

    return (
        <>
            <DomainPageTitle countBadge={(
                <Suspense>
                    <RSCWithAsyncProps
                        component={DomainsPageTitleBadge}
                        getAsyncProps={async () => {
                            const res = await getCachedDomains();
                            return { content: res.domains.length }
                        }} />
                </Suspense>
            )} />
            <Suspense>
                <DomainPageHeader />
            </Suspense>
            <Suspense fallback={<SectionLoadingIndicator />}>
                <RSCWithAsyncProps
                    component={DomainsTable}
                    getAsyncProps={async () => {
                        const res = await getCachedDomains();
                        return { domains: res.domains }
                    }} />
            </Suspense>
        </>
    );
}
