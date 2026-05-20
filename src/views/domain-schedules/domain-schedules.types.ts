import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

export type DomainSchedulesStatus = 'RUNNING' | 'PAUSED';

export type DomainSchedulesFiltersStatusValue = {
  schedulesStatus: DomainSchedulesStatus | undefined;
};

export type Props = DomainPageTabContentProps;
