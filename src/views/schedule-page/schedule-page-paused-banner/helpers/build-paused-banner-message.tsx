import React from 'react';

import isEmailShapedActor from './is-email-shaped-actor';
import { styled } from '../schedule-page-paused-banner.styles';

type PauseInfo = {
  pausedAt: string | null;
  pausedBy: string | null;
  reason: string | null;
};

export default function buildPausedBannerMessage({
  pausedAt,
  pausedBy,
  reason,
}: PauseInfo) {
  return (
    <>
      Schedule was paused
      {pausedAt ? ` ${pausedAt}` : null}
      {pausedBy ? (
        <>
          {' by '}
          {isEmailShapedActor(pausedBy) ? (
            <styled.EmailLink href={`mailto:${pausedBy}`}>{pausedBy}</styled.EmailLink>
          ) : (
            pausedBy
          )}
        </>
      ) : null}
      {reason ? (
        <>
          {'. Reason: "'}
          <styled.ReasonValue>{reason}</styled.ReasonValue>
          {'"'}
        </>
      ) : null}
    </>
  );
}
