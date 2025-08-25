import { notFound, redirect } from 'next/navigation';
import queryString from 'query-string';

import getDefaultClusterForActiveActiveDomain from '@/views/shared/active-active/helpers/get-default-cluster-for-active-active-domain';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { getCachedAllDomains } from '../domains-page/helpers/get-all-domains';

import { type Props } from './redirect-domain.types';

export default async function RedirectDomain(props: Props) {
  const [encodedDomain, ...restParams] = props.params.domainParams;
  if (!encodedDomain) {
    throw new Error('Invalid domain URL param');
  }

  const domain = decodeURIComponent(encodedDomain);

  const { domains } = await getCachedAllDomains();

  const [domainDetails, ...restDomains] = domains.filter(
    (d) => d.name === domain
  );

  if (!domainDetails) {
    notFound();
  } else if (restDomains.length > 0) {
    redirect(
      queryString.stringifyUrl({
        url: '/domains',
        query: {
          // TODO @assem.hafez: see if this type can be asserted
          s: domain,
        },
      })
    );
  }

  const clusterToRedirectTo = isActiveActiveDomain(domainDetails)
    ? getDefaultClusterForActiveActiveDomain(domainDetails)
    : domainDetails.activeClusterName;

  const baseUrl = `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(clusterToRedirectTo)}`;

  redirect(
    queryString.stringifyUrl({
      url: baseUrl + (restParams.length > 0 ? `/${restParams.join('/')}` : ''),
      query: props.searchParams,
    })
  );
}
