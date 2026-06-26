import { resolveAuthContext } from '@/utils/auth/auth-context';

import BATCH_ACTIONS_UI_ENABLED_VALUES_CONFIG from './batch-actions-ui-enabled-values.config';
import {
  type BatchActionsUiEnabledResolverParams,
  type BatchActionsUiMode,
} from './batch-actions-ui-enabled.types';
import domainAccess from './domain-access';

function resolveMode(): BatchActionsUiMode | undefined {
  const raw = process.env.CADENCE_BATCH_ACTIONS_UI_ENABLED;
  return BATCH_ACTIONS_UI_ENABLED_VALUES_CONFIG.find((mode) => mode === raw);
}

/**
 * Returns whether the Batch Actions feature is enabled for the current user/domain.
 *
 * Controlled by the CADENCE_BATCH_ACTIONS_UI_ENABLED env variable:
 * - `ENABLED` — enabled for everyone.
 * - `ADMIN`   — enabled when auth is disabled, or for users with the global admin claim.
 * - `WRITE`   — enabled for users with write access to the domain.
 * - unset / any other value — disabled for everyone.
 *
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the Batch Actions feature is enabled.
 */
export default async function batchActionsUiEnabled({
  domain,
  cluster,
}: BatchActionsUiEnabledResolverParams): Promise<boolean> {
  const mode = resolveMode();

  try {
    switch (mode) {
      case 'ENABLED':
        return true;
      case 'WRITE':
        return (await domainAccess({ domain, cluster })).canWrite;
      case 'ADMIN': {
        const authContext = await resolveAuthContext();
        return !authContext.authEnabled || authContext.isAdmin;
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}
