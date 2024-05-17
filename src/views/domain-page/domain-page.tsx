import React, { Suspense } from 'react';

import AsyncPropsLoader from '@/components/async-props-loader/async-props-loader';
import decodeUrlParams from '@/utils/decode-url-params';

import { Props } from './domain-page.types';
import { getCachedDomainInfo } from './helpers/get-domain-info';
import DomainPageHeader from './domain-page-header/domain-page-header';
import DomainPageHeaderInfo from './domain-page-header-info/domain-page-header-info';
import DomainPageTabs from './domain-page-tabs/domain-page-tabs';

export default async function DomainPage(props: Props) {
  const decodedParams = decodeUrlParams(props.params);
  return (
    <>
      <DomainPageHeader
        domain={decodedParams.domain}
        domainMetadata={
          <Suspense fallback={<DomainPageHeaderInfo loading />}>
            <AsyncPropsLoader
              component={DomainPageHeaderInfo}
              getAsyncProps={async () => {
                const res = await getCachedDomainInfo(decodedParams.cluster, {
                  name: decodedParams.domain,
                });
                return {
                  loading: false,
                  domainInfo: res.domain,
                  cluster: decodedParams.cluster,
                };
              }}
            />
          </Suspense>
        }
      />
      <DomainPageTabs />
      {/* props.children is injected here by the Next router, loading domain-page-content.tsx  */}
      {props.children}
    </>
  );
}
