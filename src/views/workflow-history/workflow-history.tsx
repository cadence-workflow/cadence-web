'use client';
import React from 'react';

import { HeadingXSmall } from 'baseui/typography';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './workflow-history.styles';

export default function WorkflowHistory() {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.pageContainer}>
      <HeadingXSmall>Workflow history</HeadingXSmall>
      <div className={cls.eventsContainer}>
        <section className={cls.compactSection}>
          <p>compact</p>
        </section>
        <section className={cls.timelineSection}>
          <p>timeline</p>
        </section>
      </div>
    </div>
  );
}
