import { getHealthCheck } from '@/route-handlers/health-check/health-check';

export function GET() {
  return getHealthCheck();
}
