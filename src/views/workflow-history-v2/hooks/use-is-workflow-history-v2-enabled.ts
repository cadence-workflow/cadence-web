import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

export default function useIsWorkflowHistoryV2Enabled(): boolean {
  const { data: historyPageV2Config } = useSuspenseConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  return historyPageV2Config === 'ENABLED' || historyPageV2Config === 'OPT-OUT';
}
