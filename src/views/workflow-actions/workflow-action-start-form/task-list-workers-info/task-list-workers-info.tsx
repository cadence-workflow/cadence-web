import React, { useMemo } from 'react';

import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { MdWarning } from 'react-icons/md';

import { overrides } from './task-list-workers-info.styles';
import { type Props } from './task-list-workers-info.types';

export default function TaskListWorkersInfo({ data }: Props) {
  const warningMessage = useMemo(() => {
    const workers = data.taskList.workers;
    const hasDecision = workers.some((w) => w.hasDecisionHandler);
    const hasActivity = workers.some((w) => w.hasActivityHandler);

    if (!hasDecision && !hasActivity) {
      return 'This task list has no workers';
    }
    if (!hasDecision) {
      return 'This task list has no decision workers';
    }
    if (!hasActivity) {
      return 'This task list has no activity workers';
    }
    return null;
  }, [data.taskList.workers]);

  if (!warningMessage) {
    return null;
  }

  return (
    <div data-testid="task-list-workers-info">
      <Banner
        hierarchy={HIERARCHY.low}
        kind={BANNER_KIND.warning}
        overrides={overrides.banner}
        artwork={{
          icon: MdWarning,
        }}
      >
        {warningMessage}
      </Banner>
    </div>
  );
}
