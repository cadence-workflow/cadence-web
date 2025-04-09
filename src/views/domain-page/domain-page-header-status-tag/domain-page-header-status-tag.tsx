import { useSuspenseQuery } from '@tanstack/react-query';

import request from '@/utils/request';
import DomainStatusTag from '@/views/shared/domain-status-tag/domain-status-tag';

import { type DomainInfo } from '../domain-page.types';

import { type Props } from './domain-page-header-status-tag.types';

export default function DomainPageHeaderStatusTag(props: Props) {
  const { data: domainDescription } = useSuspenseQuery<DomainInfo>({
    queryKey: ['describeDomain', props],
    queryFn: () =>
      request(`/api/domains/${props.domain}/${props.cluster}`).then((res) =>
        res.json()
      ),
  });

  if (domainDescription.status === 'DOMAIN_STATUS_REGISTERED') {
    return null;
  }

  return <DomainStatusTag status={domainDescription.status} />;
}
