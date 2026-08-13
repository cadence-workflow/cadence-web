import workflowHistoryEventGroupDetailsConfig from '../config/workflow-history-event-group-details.config';
import {
  type EventDetailsConfig,
  type EventDetailsFuncArgs,
} from '../workflow-history-event-details/workflow-history-event-details.types';

export default function getHistoryEventFieldRenderConfig(
  { path, key, value }: EventDetailsFuncArgs,
  configs: EventDetailsConfig[] = workflowHistoryEventGroupDetailsConfig
): EventDetailsConfig | null {
  const config = configs.find((config) => {
    if ('key' in config && config.key === key) return true;
    if ('path' in config && config.path === path) return true;
    if ('pathRegex' in config && new RegExp(config.pathRegex).test(path))
      return true;
    if ('customMatcher' in config && config.customMatcher({ path, key, value }))
      return true;

    return false;
  });
  return config ?? null;
}
