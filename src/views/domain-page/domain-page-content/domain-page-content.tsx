import React from 'react';
import decodeUrlParams from '@/utils/decode-url-params';

import {
  type DomainPageContentParams,
  type Props,
} from './domain-page-content.types';

export default async function DomainPageContent(props: Props) {
  const decodedParams = decodeUrlParams(
    props.params
  ) as DomainPageContentParams;
  // Add a switch case here, and depending on what domainTab is, return the corresponding page content
  // Otherwise just throw a 404: https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props#notfound
  return (
    <section>
      <div>Selected tab: {decodedParams.domainTab}</div>
    </section>
  );
}
