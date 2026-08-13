import { type z } from 'zod';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import { createDomainSchedulesCreateFormData } from '../../__fixtures__/mock-domain-schedules-create-form-data';
import { type CreateScheduleFormRefineInput } from '../../domain-schedules-create-modal.types';
import refineCreateScheduleForm from '../refine-create-schedule-form';

describe(refineCreateScheduleForm.name, () => {
  it('accepts when advanced fields are omitted', () => {
    expect(getIssues({})).toEqual([]);
  });

  it('accepts valid buffer limit for buffer overlap policy', () => {
    expect(
      getIssues({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        bufferLimit: '3',
      })
    ).toEqual([]);
  });

  it('accepts valid concurrency limit for concurrent overlap policy', () => {
    expect(
      getIssues({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
        concurrencyLimit: '2',
      })
    ).toEqual([]);
  });

  it('accepts catch-up window when catch-up policy is not skip', () => {
    expect(
      getIssues({
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
        catchUpWindowDays: '7',
      })
    ).toEqual([]);
  });

  it('accepts schedule period when start is before end', () => {
    expect(
      getIssues({
        startTime: '2026-06-23T12:00:00.000Z',
        endTime: '2026-06-30T12:00:00.000Z',
      })
    ).toEqual([]);
  });

  it('rejects invalid buffer limit for buffer overlap policy', () => {
    expect(
      getIssues({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        bufferLimit: '-1',
      })
    ).toEqual([
      expect.objectContaining({
        path: ['bufferLimit'],
        message: 'Buffer limit must be a non-negative integer',
      }),
    ]);
  });

  it('rejects invalid concurrency limit for concurrent overlap policy', () => {
    expect(
      getIssues({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
        concurrencyLimit: '1.5',
      })
    ).toEqual([
      expect.objectContaining({
        path: ['concurrencyLimit'],
        message: 'Concurrency limit must be a non-negative integer',
      }),
    ]);
  });

  it('requires catch-up window when catch-up policy is not skip', () => {
    expect(
      getIssues({
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL,
      })
    ).toEqual([
      expect.objectContaining({
        path: ['catchUpWindowDays'],
        message: 'Catch-up window is required',
      }),
    ]);
  });

  it('rejects schedule period when start is not before end', () => {
    expect(
      getIssues({
        startTime: '2026-06-30T12:00:00.000Z',
        endTime: '2026-06-23T12:00:00.000Z',
      })
    ).toEqual([
      expect.objectContaining({
        path: ['endTime'],
        message: 'Start date must be before end date',
      }),
    ]);
  });

  it('accepts valid memo JSON object', () => {
    expect(getIssues({ memo: '{"k":"v"}' })).toEqual([]);
  });

  it('rejects invalid memo JSON', () => {
    expect(getIssues({ memo: 'not-json' })).toEqual([
      expect.objectContaining({
        path: ['memo'],
        message: 'Memo must be valid JSON',
      }),
    ]);
  });

  it('rejects memo JSON that is not an object', () => {
    expect(getIssues({ memo: '["array"]' })).toEqual([
      expect.objectContaining({
        path: ['memo'],
        message: 'Memo must be a JSON object',
      }),
    ]);
  });
});

function getIssues(overrides: Partial<CreateScheduleFormRefineInput> = {}) {
  const issues: Array<z.IssueData> = [];

  refineCreateScheduleForm(createDomainSchedulesCreateFormData(overrides), {
    addIssue: (issue) => {
      issues.push(issue);
    },
  } as z.RefinementCtx);

  return issues;
}
