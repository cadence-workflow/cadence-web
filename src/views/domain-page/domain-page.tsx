import React from 'react';

import decodeUrlParams from '@/utils/decode-url-params';

import DomainPageContextProvider from './domain-page-context-provider/domain-page-context-provider';
import DomainPageHeader from './domain-page-header/domain-page-header';
import DomainPageTabs from './domain-page-tabs/domain-page-tabs';
import { type Props } from './domain-page.types';

export default async function DomainPage(props: Props) {
  const decodedParams = decodeUrlParams(props.params);
  return (
    <DomainPageContextProvider>
      <DomainPageHeader
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
      />
      <DomainPageTabs />
      {/* props.children is injected here by the Next router, loading domain-page-content.tsx  */}
      {props.children}
    </DomainPageContextProvider>
  );
}
