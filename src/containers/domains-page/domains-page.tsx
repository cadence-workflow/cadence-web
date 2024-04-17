import React, { JSXElementConstructor, Suspense } from 'react';
import DomainPageHeader from '@/containers/domains-page/domains-page-filters/domains-page-filters';
import DomainsTable from '@/containers/domains-page/domains-table/domains-table';
import DomainPageTitle from '@/containers/domains-page/domains-page-title/domains-page-title';
import DomainsPageTitleBadge from '@/containers/domains-page/domains-page-title-badge/domains-page-title-badge';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import { getCachedAllDomains } from '@/containers/domains-page/helpers/get-all-domains';

async function RSCWithAsyncProps<
  Component extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  ComponentProps extends React.ComponentProps<Component>,
>({
  component,
  getAsyncProps,
}: {
  component: Component;
  getAsyncProps: () => Promise<ComponentProps>;
}) {
  const asyncProps = await getAsyncProps();
  const Component = component;
  return <Component {...asyncProps} />;
}

export default async function DomainsPage() {
  return (
    <>
      <DomainPageTitle
        countBadge={
          <Suspense>
            <RSCWithAsyncProps
              component={DomainsPageTitleBadge}
              getAsyncProps={async () => {
                const res = await getCachedAllDomains();
                return { content: res.domains.length };
              }}
            />
          </Suspense>
        }
      />
      <Suspense>
        <DomainPageHeader />
      </Suspense>
      <Suspense fallback={<SectionLoadingIndicator />}>
        <RSCWithAsyncProps
          component={DomainsTable}
          getAsyncProps={async () => {
            const res = await getCachedAllDomains();
            return { domains: res.domains };
          }}
        />
      </Suspense>
    </>
  );
}
