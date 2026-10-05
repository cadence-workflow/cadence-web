import Link from '@/components/link/link';

import { type Props } from './domain-schedules-create-success-msg.types';

export default function DomainSchedulesCreateSuccessMsg({
  domain,
  cluster,
  scheduleId,
  onDismissMessage,
}: Props) {
  return (
    <>
      {'Schedule has been created. '}
      <Link
        color="contentInversePrimary"
        href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/schedules/${encodeURIComponent(scheduleId)}/details`}
        onClick={onDismissMessage}
      >
        Click here
      </Link>{' '}
      to view the new schedule.
    </>
  );
}
