import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';

export type Props = {
  failoverEvent: FailoverEvent;
  isOpen: boolean;
  onClose: () => void;
};
