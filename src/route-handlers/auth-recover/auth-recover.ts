import { type NextRequest, NextResponse } from 'next/server';

import {
  DEFAULT_AUTH_RETURN_TO,
  NO_STORE_HEADERS,
} from '@/utils/auth/auth.constants';
import {
  type AuthRecoveryResult,
  type AuthLogoutNotice,
} from '@/utils/auth/auth.types';
import validateAndReplayAuthCookieMutations from '@/utils/auth/cookies/validate-and-replay-auth-cookie-mutations';
import { isAuthLogoutNotice } from '@/utils/auth/helpers/is-auth-logout-notice';
import isSameOriginRequest from '@/utils/auth/helpers/is-same-origin-request';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';
import getActiveAuthServerEntry from '@/utils/auth/strategies/get-active-auth-server-entry';
import logger from '@/utils/logger';

type RecoverContext = { returnTo?: string; notice?: AuthLogoutNotice };

async function parseRecoverContext(
  request: NextRequest
): Promise<RecoverContext> {
  try {
    const body = (await request.json()) as {
      returnTo?: string | null;
      notice?: string | null;
    };
    return {
      returnTo: sanitizeReturnTo(body.returnTo),
      notice: isAuthLogoutNotice(body.notice) ? body.notice : undefined,
    };
  } catch {
    return {};
  }
}

// If the recovered cookies are too big to write, redirect to login with a
// "session expired" notice and clear the old session instead.
export async function handleAuthRecover(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { message: 'Cross-origin request rejected' },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { message: 'Invalid request' },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const ctx = await parseRecoverContext(request);
    const entry = await getActiveAuthServerEntry();
    const recovery = await entry.policy.recoverSession(
      { cookies: request.cookies, headers: request.headers },
      ctx
    );

    const response = NextResponse.json(
      recovery.result satisfies AuthRecoveryResult,
      { headers: NO_STORE_HEADERS }
    );

    if (recovery.cookieMutations?.length) {
      const replay = await validateAndReplayAuthCookieMutations(
        request,
        response,
        recovery.cookieMutations
      );
      if (!replay.ok) {
        if (replay.reason === 'over-budget' && recovery.cleanupMutations) {
          logger.warn(
            { totalBytes: replay.totalBytes },
            'Recovered session exceeds the cookie budget; clearing the burnt session'
          );
          const substituted = NextResponse.json(
            {
              kind: 'redirect',
              returnTo: ctx.returnTo ?? DEFAULT_AUTH_RETURN_TO,
              notice: 'session-expired',
            } satisfies AuthRecoveryResult,
            { headers: NO_STORE_HEADERS }
          );
          const cleanup = await validateAndReplayAuthCookieMutations(
            request,
            substituted,
            recovery.cleanupMutations
          );
          if (cleanup.ok) {
            return substituted;
          }
        }
        logger.error(
          { reason: replay.reason },
          'Auth recovery cookie mutations rejected'
        );
        return NextResponse.json(
          { message: 'Session recovery failed' },
          { status: 500, headers: NO_STORE_HEADERS }
        );
      }
    }

    return response;
  } catch (e) {
    logger.error({ error: e }, 'Error recovering auth session');
    return NextResponse.json(
      { message: 'Session recovery failed' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
