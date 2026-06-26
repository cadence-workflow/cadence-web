import type BATCH_ACTIONS_UI_ENABLED_VALUES_CONFIG from './batch-actions-ui-enabled-values.config';

export type BatchActionsUiMode =
  (typeof BATCH_ACTIONS_UI_ENABLED_VALUES_CONFIG)[number];

export type BatchActionsUiEnabledResolverParams = {
  domain: string;
  cluster: string;
};
