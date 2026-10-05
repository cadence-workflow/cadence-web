import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';

import { USE_SCHEDULE_CATCH_UP_POLICY } from '../../schedule-action-resume-form.constants';
import transformResumeScheduleFormToSubmission from '../transform-resume-schedule-form-to-submission';

describe(transformResumeScheduleFormToSubmission.name, () => {
  it('omits empty reason and schedule-policy default', () => {
    expect(transformResumeScheduleFormToSubmission({})).toEqual({});
    expect(transformResumeScheduleFormToSubmission({ reason: '   ' })).toEqual(
      {}
    );
    expect(
      transformResumeScheduleFormToSubmission({
        catchUpPolicy: USE_SCHEDULE_CATCH_UP_POLICY,
      })
    ).toEqual({});
  });

  it('includes trimmed reason and explicit catchUpPolicy when provided', () => {
    expect(
      transformResumeScheduleFormToSubmission({
        reason: '  Resuming after maintenance  ',
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
      })
    ).toEqual({
      reason: 'Resuming after maintenance',
      catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
    });
  });
});
