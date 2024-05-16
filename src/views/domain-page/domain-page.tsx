import React, { Suspense } from 'react';

import AsyncPropsLoader from '@/components/async-props-loader/async-props-loader';
import decodeURLParams from '@/utils/decode-url-params';

import { Props } from './domain-page.types';
import DomainPageHeader from './domain-page-header/domain-page-header';
import DomainPageHeaderInfo from './domain-page-header-info/domain-page-header-info';
import { getCachedDomainInfo } from './helpers/get-domain-info';

export default async function DomainPage(props: Props) {
  const decodedParams = decodeURLParams(props.params);
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
      {/* TODO: Add Tabs here */}
      {/* props.children is injected here by the Next router, loading domain-page-content.tsx  */}
      {props.children}
    </>
  );
}
