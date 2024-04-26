import React, { JSXElementConstructor, Suspense } from 'react';
import DomainPageHeader from '@/views/domains-page/domains-page-filters/domains-page-filters';
import DomainsTable from '@/views/domains-page/domains-table/domains-table';
import DomainPageTitle from '@/views/domains-page/domains-page-title/domains-page-title';
import DomainsPageTitleBadge from '@/views/domains-page/domains-page-title-badge/domains-page-title-badge';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import { getCachedAllDomains } from '@/views/domains-page/helpers/get-all-domains';
import AsyncPropsLoader from '@/components/async-props-loader/async-props-loader';

export default async function DomainsPage() {
  return (
    <>
      <DomainPageTitle
        countBadge={
          <Suspense>
            <AsyncPropsLoader
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
        <AsyncPropsLoader
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
