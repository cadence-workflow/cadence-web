export type DomainSchedulesStatus = 'RUNNING' | 'PAUSED';

export type DomainSchedulesFiltersStatusValue = {
  schedulesStatus: DomainSchedulesStatus | undefined;
};
