import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

export default function useSuspenseIsWorkflowHistoryV2Enabled(): boolean {
  const { data: historyPageV2Config } = useSuspenseConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  // TODO @adhitya.mamallan - implement local-storage based behaviour for remembering opt-ins
  return historyPageV2Config === 'ENABLED' || historyPageV2Config === 'OPT_OUT';
}
