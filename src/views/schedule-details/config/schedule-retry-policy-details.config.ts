import { createElement } from 'react';

import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';

import ScheduleDetailsBadges from '../schedule-details-badges/schedule-details-badges';
import { formatScheduleDuration } from '../helpers/schedule-details-formatters';
import { hideWithoutRetryPolicy } from '../helpers/schedule-details-row-hide';

const scheduleRetryPolicyDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'retryPolicy.initialInterval',
    getLabel: () => 'retryPolicy.initialInterval',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.retryPolicy?.initialInterval
      ),
    hide: hideWithoutRetryPolicy,
  },
  {
    key: 'retryPolicy.backoffCoefficient',
    getLabel: () => 'retryPolicy.backoffCoefficient',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.retryPolicy?.backoffCoefficient,
    hide: hideWithoutRetryPolicy,
  },
  {
    key: 'retryPolicy.maximumInterval',
    getLabel: () => 'retryPolicy.maximumInterval',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.retryPolicy?.maximumInterval
      ),
    hide: hideWithoutRetryPolicy,
  },
  {
    key: 'retryPolicy.maximumAttempts',
    getLabel: () => 'retryPolicy.maximumAttempts',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.retryPolicy?.maximumAttempts,
    hide: hideWithoutRetryPolicy,
  },
  {
    key: 'retryPolicy.expirationInterval',
    getLabel: () => 'retryPolicy.expirationInterval',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.retryPolicy?.expirationInterval
      ),
    hide: hideWithoutRetryPolicy,
  },
  {
    key: 'retryPolicy.nonRetryableErrorReasons',
    getLabel: () => 'retryPolicy.nonRetryableErrorReasons',
    getValue: ({ describeSchedule }) => {
      const reasons =
        describeSchedule.action?.startWorkflow?.retryPolicy
          ?.nonRetryableErrorReasons;
      if (!reasons?.length) {
        return null;
      }

      return createElement(ScheduleDetailsBadges, { labels: reasons });
    },
    hide: hideWithoutRetryPolicy,
  },
];

export default scheduleRetryPolicyDetailsConfig;
