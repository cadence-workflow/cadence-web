import {
  type GetConfigArgs,
  type GetConfigKeys,
} from '@/route-handlers/get-config/get-config.types';

export type ConfigTabGate<Name extends string> = {
  /** The tab key controlled by this config gate. */
  tab: Name;
  /** Human-readable tab name, used in the failure snackbar. */
  title: string;
  /** The dynamic config key whose resolver decides tab visibility. */
  key: GetConfigKeys;
  args?: GetConfigArgs<GetConfigKeys>;
};

/** Value-or-error sentinel so a failed resolver does not throw under suspense. */
export type ConfigGateResult =
  | { status: 'ok'; enabled: boolean }
  | { status: 'error' };

export type UseConfigGatedTabsResult<Name extends string> = {
  /** Tabs to omit — either disabled or failed to resolve (fail closed). */
  tabsToHide: Array<Name>;
};
