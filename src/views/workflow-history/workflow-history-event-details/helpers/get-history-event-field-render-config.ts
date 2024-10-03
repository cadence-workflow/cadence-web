import workflowHistoryEventDetailsConfig from '../../config/workflow-history-event-details.config';
import {
  type WorkflowHistoryEventDetailsConfig,
  type WorkflowHistoryEventDetailsFuncArgs,
} from '../workflow-history-event-details.types';

export default function getHistoryEventFieldRenderConfig(
  { path, key, value }: WorkflowHistoryEventDetailsFuncArgs,
  configs: WorkflowHistoryEventDetailsConfig[] = workflowHistoryEventDetailsConfig
): WorkflowHistoryEventDetailsConfig | null {
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
