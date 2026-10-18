import RedirectDomain from '@/views/redirect-domain/redirect-domain';
import { type Props } from '@/views/redirect-domain/redirect-domain.types';

export default async function RedirectDomainPage(props: {
  params: Promise<Props['params']>;
  searchParams?: Promise<Props['searchParams']>;
}) {
  return RedirectDomain({
    params: await props.params,
    searchParams: await props.searchParams,
  });
}
