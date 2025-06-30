import { useCallback, useEffect, useMemo, useState } from 'react';

import getAutocompleteSuggestions from '../helpers/get-autocomplete-suggestions';
import getUpdatedQueryTextWithSuggestion from '../helpers/get-updated-query-text-with-suggestion';

export default function useQueryTextWithAutocomplete({
  initialValue,
}: {
  initialValue: string;
}) {
  const [queryText, setQueryText] = useState<string>('');

  useEffect(() => {
    setQueryText(initialValue);
  }, [initialValue]);

  const nextSuggestions = useMemo(
    () => (queryText ? getAutocompleteSuggestions(queryText) : []),
    [queryText]
  );

  const onSuggestionSelect = useCallback(
    (suggestion: string) => {
      setQueryText(getUpdatedQueryTextWithSuggestion(queryText, suggestion));
    },
    [queryText, setQueryText]
  );

  return {
    queryText,
    setQueryText,
    nextSuggestions,
    onSuggestionSelect,
  };
}
