'use client';
import { Skeleton } from 'baseui/skeleton';

import { overrides } from './pretty-json-skeleton.styles';
import { type Props } from './pretty-json-skeleton.types';

export default function PrettyJsonSkeleton({ width }: Props) {
  return (
    <div>
      <Skeleton
        width="20px"
        rows={1}
        overrides={overrides.borderSkeleton}
        animation
      />
      <Skeleton
        width={width}
        rows={3}
        overrides={overrides.centralSkeleton}
        animation
      />
      <Skeleton
        width="20px"
        rows={1}
        overrides={overrides.borderSkeleton}
        animation
      />
    </div>
  );
}
