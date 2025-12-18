'use client';
import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getDomainAccessForUser } from '@/utils/auth/auth-shared';
import getDomainDescriptionQueryOptions from '@/views/shared/hooks/use-domain-description/get-domain-description-query-options';
import { type UseDomainDescriptionParams } from '@/views/shared/hooks/use-domain-description/use-domain-description.types';

import useUserInfo from '../use-user-info/use-user-info';

export default function useDomainAccess(params: UseDomainDescriptionParams) {
  const userInfoQuery = useUserInfo();
  const isRbacEnabled = userInfoQuery.data?.rbacEnabled === true;

  const domainQuery = useQuery({
    ...getDomainDescriptionQueryOptions(params),
    enabled: isRbacEnabled,
  });

  const access = useMemo(() => {
    if (userInfoQuery.isError) {
      return { canRead: false, canWrite: false };
    }

    if (!userInfoQuery.data) {
      return undefined;
    }

    if (!userInfoQuery.data.rbacEnabled) {
      return { canRead: true, canWrite: true };
    }

    if (domainQuery.data) {
      return getDomainAccessForUser(domainQuery.data, userInfoQuery.data);
    }

    if (domainQuery.isError) {
      return { canRead: false, canWrite: false };
    }

    return undefined;
  }, [
    domainQuery.data,
    domainQuery.isError,
    userInfoQuery.data,
    userInfoQuery.isError,
  ]);

  const isLoading =
    userInfoQuery.isLoading || (isRbacEnabled && domainQuery.isLoading);

  return {
    access,
    isLoading,
    isError: userInfoQuery.isError || domainQuery.isError,
    userInfoQuery,
  };
}
