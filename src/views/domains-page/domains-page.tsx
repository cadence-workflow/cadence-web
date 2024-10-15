import React, { Suspense } from 'react';

import AsyncPropsLoader from '@/components/async-props-loader/async-props-loader';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';

import DomainsPageErrorBanner from './domains-page-error-banner/domains-page-error-banner';
import DomainsPageFilters from './domains-page-filters/domains-page-filters';
import DomainsPageTitle from './domains-page-title/domains-page-title';
import DomainsPageTitleBadge from './domains-page-title-badge/domains-page-title-badge';
import DomainsTable from './domains-table/domains-table';
import { getCachedAllDomains } from './helpers/get-all-domains';

export default async function DomainsPage() {
  return (
    <>
      <DomainsPageTitle
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
      <DomainsPageFilters />
      <Suspense>
        <AsyncPropsLoader
          component={DomainsPageErrorBanner}
          getAsyncProps={async () => {
            const res = await getCachedAllDomains();
            return { failedClusters: res.failedClusters };
          }}
        />
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
