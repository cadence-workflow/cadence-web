import { NextResponse } from 'next/server';

import { type HealthCheckResponse } from './health-check.types';

export function getHealthCheck() {
  const body: HealthCheckResponse = { status: 'ok' };

  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
