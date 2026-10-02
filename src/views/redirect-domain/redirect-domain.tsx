import { notFound, redirect } from 'next/navigation';
import queryString from 'query-string';

import describeDomainAcrossClusters from './helpers/describe-domain-across-clusters';
import { type Props } from './redirect-domain.types';

export default async function RedirectDomain(props: Props) {
  const [encodedDomain, ...restParams] = props.params.domainParams;
  if (!encodedDomain) {
    throw new Error('Invalid domain URL param');
  }

  const domain = decodeURIComponent(encodedDomain);

  const { domains, hasPermissionDenied, unexpectedError } =
    await describeDomainAcrossClusters(domain);

  if (domains.length === 0) {
    if (unexpectedError) {
      throw unexpectedError;
    }
    if (hasPermissionDenied) {
      throw new Error(`Access denied for domain "${domain}"`);
    }
    notFound();
  }

  if (domains.length > 1) {
    redirect(
      queryString.stringifyUrl({
        url: '/domains',
        query: {
          s: domain,
          d: 'true',
        },
      })
    );
  }

  const domainDetails = domains[0];

  const baseUrl = `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(domainDetails.activeClusterName)}`;

  redirect(
    queryString.stringifyUrl({
      url: baseUrl + (restParams.length > 0 ? `/${restParams.join('/')}` : ''),
      query: props.searchParams,
    })
  );
}
