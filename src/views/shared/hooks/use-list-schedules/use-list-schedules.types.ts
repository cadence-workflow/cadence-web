import { type RouteParams as ListSchedulesRouteParams } from '@/route-handlers/list-schedules/list-schedules.types';

export type UseListSchedulesParams = ListSchedulesRouteParams & {
  pageSize: number;
};
