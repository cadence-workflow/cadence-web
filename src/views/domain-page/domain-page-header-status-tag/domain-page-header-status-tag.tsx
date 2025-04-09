import DomainStatusTag from '@/views/shared/domain-status-tag/domain-status-tag';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-suspense-domain-description';

import { type Props } from './domain-page-header-status-tag.types';

export default function DomainPageHeaderStatusTag(props: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription(props);

  if (domainDescription.status === 'DOMAIN_STATUS_REGISTERED') {
    return null;
  }

  return <DomainStatusTag status={domainDescription.status} />;
}
