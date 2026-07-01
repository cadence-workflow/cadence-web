import domainAccess from './domain-access';
import {
  AUTHORIZED_SCHEDULE_ACTIONS_CONFIG,
  DEFAULT_DISABLED_SCHEDULE_ACTIONS_CONFIG,
  UNAUTHORIZED_SCHEDULE_ACTIONS_CONFIG,
} from './schedule-actions-enabled.constants';
import {
  type ScheduleActionsEnabledConfig,
  type ScheduleActionsEnabledResolverParams,
} from './schedule-actions-enabled.types';

/**
 * If you have authentication enabled for users, override this resolver
 * to control whether users can access schedule actions in the UI.
 * Domain access is resolved via the DOMAIN_ACCESS config resolver.
 */
export default async function scheduleActionsEnabled(
  params: ScheduleActionsEnabledResolverParams
): Promise<ScheduleActionsEnabledConfig> {
  try {
    const access = await domainAccess(params);
    if (!access.canWrite) {
      return UNAUTHORIZED_SCHEDULE_ACTIONS_CONFIG;
    }

    return AUTHORIZED_SCHEDULE_ACTIONS_CONFIG;
  } catch {
    return DEFAULT_DISABLED_SCHEDULE_ACTIONS_CONFIG;
  }
}
