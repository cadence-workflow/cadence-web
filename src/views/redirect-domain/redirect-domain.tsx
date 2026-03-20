import { notFound, redirect } from 'next/navigation';
import queryString from 'query-string';

import { resolveAuthContext } from '@/utils/auth/auth-context';

import getCachedAllDomains from '../domains-page/helpers/get-cached-all-domains';

import { type Props } from './redirect-domain.types';

export default async function RedirectDomain(props: Props) {
  const [encodedDomain, ...restParams] = props.params.domainParams;
  if (!encodedDomain) {
    throw new Error('Invalid domain URL param');
  }

  const domain = decodeURIComponent(encodedDomain);

  const authContext = await resolveAuthContext();
  const { domains } = await getCachedAllDomains(authContext);

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
          d: 'true',
        },
      })
    );
  }

  const baseUrl = `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(domainDetails.activeClusterName)}`;

  redirect(
    queryString.stringifyUrl({
      url: baseUrl + (restParams.length > 0 ? `/${restParams.join('/')}` : ''),
      query: props.searchParams,
    })
  );
}
