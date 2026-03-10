import { useQuery } from '@tanstack/react-query';

import getTaskListsByDomainQueryOptions from './get-task-lists-by-domain-query-options';
import { type UseTaskListsByDomainParams } from './use-task-lists-by-domain.types';

export default function useTaskListsByDomain(
  params: UseTaskListsByDomainParams
) {
  return useQuery(getTaskListsByDomainQueryOptions(params));
}
