import { type RelativeDateFilterValue } from '@/components/date-filter-v2/date-filter-v2.types';

const DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG =
  'now-30d' as const satisfies RelativeDateFilterValue;

export default DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG;
