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
 * Override this resolver if you have different
 * requirements for enabling/disabling schedule actions.
 *
 * All schedule actions are enabled by default if authorization is disabled.
 * Otherwise it is only enabled for users with write access to domain.
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
