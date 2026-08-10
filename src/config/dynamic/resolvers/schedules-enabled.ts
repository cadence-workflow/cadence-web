import { type SchedulesEnabledResolverParams } from './schedules-enabled.types';

/**
 * Returns whether the Schedules feature is enabled.
 *
 * To enable, set the CADENCE_SCHEDULES_ENABLED env variable to `true`.
 *
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the Schedules feature is enabled.
 */
export default async function schedulesEnabled(
  _: SchedulesEnabledResolverParams
): Promise<boolean> {
  return process.env.CADENCE_SCHEDULES_ENABLED === 'true';
}
