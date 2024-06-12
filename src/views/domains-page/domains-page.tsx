import React, { Suspense } from 'react';

import AsyncPropsLoader from '@/components/async-props-loader/async-props-loader';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import DomainsPageFilters from '@/views/domains-page/domains-page-filters/domains-page-filters';
import DomainsPageTitle from '@/views/domains-page/domains-page-title/domains-page-title';
import DomainsPageTitleBadge from '@/views/domains-page/domains-page-title-badge/domains-page-title-badge';
import DomainsTable from '@/views/domains-page/domains-table/domains-table';
import { getCachedAllDomains } from '@/views/domains-page/helpers/get-all-domains';

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
