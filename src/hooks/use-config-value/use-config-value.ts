import { useQuery } from '@tanstack/react-query';

import {
  type GetConfigArgs,
  type GetConfigKeys,
  type GetConfigKeysWithArgs,
  type GetConfigKeysWithoutArgs,
} from '@/route-handlers/get-config/get-config.types';

import getConfigValueQueryOptions from './get-config-value-query-options';
import { type UseConfigValueResult } from './use-config-value.types';

export default function useConfigValue<K extends GetConfigKeysWithoutArgs>(
  key: K,
  args?: GetConfigArgs<K>
): UseConfigValueResult<K>;

export default function useConfigValue<K extends GetConfigKeysWithArgs>(
  key: K,
  args: GetConfigArgs<K>
): UseConfigValueResult<K>;

export default function useConfigValue<K extends GetConfigKeys>(
  key: K,
  args?: GetConfigArgs<K>
): UseConfigValueResult<K> {
  return useQuery(
    getConfigValueQueryOptions<K>({ key, args: args as GetConfigArgs<K> })
  );
}
