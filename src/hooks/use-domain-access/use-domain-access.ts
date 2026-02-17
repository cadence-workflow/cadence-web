'use client';
import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  FULL_ACCESS,
  NO_ACCESS,
  getDomainAccessForUser,
  type DomainAccess,
} from '@/utils/auth/auth-shared';
import getDomainDescriptionQueryOptions from '@/views/shared/hooks/use-domain-description/get-domain-description-query-options';
import { type UseDomainDescriptionParams } from '@/views/shared/hooks/use-domain-description/use-domain-description.types';

import useUserInfo from '../use-user-info/use-user-info';

export default function useDomainAccess(params: UseDomainDescriptionParams) {
  const userInfoQuery = useUserInfo();
  const isAuthEnabled = userInfoQuery.data?.authEnabled === true;
  const isAuthenticated = userInfoQuery.data?.isAuthenticated === true;
  const shouldFetchDomain = isAuthEnabled && isAuthenticated;

  const domainQuery = useQuery({
    ...getDomainDescriptionQueryOptions(params),
    enabled: shouldFetchDomain,
  });

  const access = useMemo<DomainAccess | undefined>(() => {
    if (userInfoQuery.isError) {
      return NO_ACCESS;
    }

    if (!userInfoQuery.data) {
      return undefined;
    }

    if (!userInfoQuery.data.authEnabled) {
      return FULL_ACCESS;
    }

    if (!userInfoQuery.data.isAuthenticated) {
      return NO_ACCESS;
    }

    if (domainQuery.data) {
      return getDomainAccessForUser(domainQuery.data, userInfoQuery.data);
    }

    if (domainQuery.isError) {
      return NO_ACCESS;
    }

    return undefined;
  }, [
    domainQuery.data,
    domainQuery.isError,
    userInfoQuery.data,
    userInfoQuery.isError,
  ]);

  const isLoading =
    userInfoQuery.isLoading || (shouldFetchDomain && domainQuery.isLoading);

  return {
    access,
    isLoading,
    isError: userInfoQuery.isError || domainQuery.isError,
  };
}
