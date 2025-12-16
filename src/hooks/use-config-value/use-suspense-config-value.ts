import { useSuspenseQuery } from '@tanstack/react-query';

import {
  type GetConfigKeys,
  type GetConfigArgs,
  type GetConfigKeysWithArgs,
  type GetConfigKeysWithoutArgs,
} from '@/route-handlers/get-config/get-config.types';

import getConfigValueQueryOptions from './get-config-value-query-options';
import { type UseSuspenseConfigValueResult } from './use-config-value.types';

export default function useSuspenseConfigValue<
  K extends GetConfigKeysWithoutArgs,
>(key: K, args?: GetConfigArgs<K>): UseSuspenseConfigValueResult<K>;

export default function useSuspenseConfigValue<K extends GetConfigKeysWithArgs>(
  key: K,
  args: GetConfigArgs<K>
): UseSuspenseConfigValueResult<K>;

export default function useSuspenseConfigValue<K extends GetConfigKeys>(
  key: K,
  args?: GetConfigArgs<K>
): UseSuspenseConfigValueResult<K> {
  return useSuspenseQuery(
    getConfigValueQueryOptions({ key, args: args as GetConfigArgs<K> })
  );
}
