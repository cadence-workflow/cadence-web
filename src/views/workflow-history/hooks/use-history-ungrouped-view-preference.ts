import useLocalStorageValue from '@/hooks/use-local-storage-value';

export default function useHistoryUngroupedViewPreference() {
  return useLocalStorageValue<boolean>({
    key: 'history-ungrouped-view-enabled',
    encode: (val) => (val ? 'true' : 'false'),
    decode: (val) => val === 'true',
  });
}
