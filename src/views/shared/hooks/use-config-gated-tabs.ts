'use client';
import { useEffect } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';
import { DURATION, useSnackbar } from 'baseui/snackbar';
import queryString from 'query-string';

import request from '@/utils/request';

import { overrides } from './use-config-gated-tabs.styles';
import {
  type ConfigTabGate,
  type ConfigGateResult,
  type UseConfigGatedTabsResult,
} from './use-config-gated-tabs.types';

/**
 * Resolves a set of config-gated tabs without failing the whole tab bar when a
 * resolver errors.
 *
 * Suspends only while loading (so the tab bar renders all at once, no pop-in),
 * but the query resolves to a value-or-error sentinel instead of throwing — a
 * single failing resolver can't tear down the bar via the error boundary. Tabs
 * fail closed (hidden unless the resolver returned `true`) and any tab whose
 * resolver errored is surfaced in one error snackbar.
 */
export default function useConfigGatedTabs<Name extends string>(
  gates: Array<ConfigTabGate<Name>>
): UseConfigGatedTabsResult<Name> {
  const { enqueue } = useSnackbar();

  const results = useSuspenseQueries({
    queries: gates.map((gate) => ({
      // Distinct key from `dynamic_config` so the sentinel shape does not
      // clobber the boolean cache read by plain useConfigValue consumers.
      queryKey: [
        'dynamic_config_gated',
        { configKey: gate.key, jsonArgs: gate.args },
      ] as const,
      // Resolve (never throw) so suspense only gates on loading, not errors.
      queryFn: async (): Promise<ConfigGateResult> => {
        try {
          const response = await request(
            queryString.stringifyUrl({
              url: '/api/config',
              query: {
                configKey: gate.key,
                jsonArgs: JSON.stringify(gate.args),
              },
            }),
            { method: 'GET' }
          );
          return { status: 'ok', enabled: (await response.json()) === true };
        } catch {
          return { status: 'error' };
        }
      },
    })),
  });

  const tabsToHide = gates
    .filter((_, index) => {
      const result = results[index]?.data;
      return !(result?.status === 'ok' && result.enabled);
    })
    .map((gate) => gate.tab);

  const failedTitles = gates
    .filter((_, index) => results[index]?.data.status === 'error')
    .map((gate) => gate.title);
  const failedMessage = failedTitles.length
    ? `Failed to load ${failedTitles.join(', ')} tab${
        failedTitles.length > 1 ? 's' : ''
      }`
    : '';

  useEffect(() => {
    if (!failedMessage) return;
    enqueue(
      {
        message: failedMessage,
        actionMessage: 'Close',
        overrides: overrides.errorSnackbar,
      },
      DURATION.medium
    );
  }, [failedMessage, enqueue]);

  return { tabsToHide };
}
