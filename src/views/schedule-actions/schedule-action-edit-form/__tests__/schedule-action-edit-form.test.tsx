import React from 'react';

import { useForm } from 'react-hook-form';

import { render, screen } from '@/test-utils/rtl';

import ScheduleActionEditForm from '../schedule-action-edit-form';
import { type EditScheduleFormData } from '../schedule-action-edit-form.types';

const mockCreateForm = jest.fn();

jest.mock(
  '@/views/domain-schedules/domain-schedules-create-form/domain-schedules-create-form',
  () =>
    function MockDomainSchedulesCreateForm(props: any) {
      mockCreateForm(props);
      return <div>mock create form</div>;
    }
);

describe(ScheduleActionEditForm.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the create schedule form', () => {
    setup();

    expect(screen.getByText('mock create form')).toBeInTheDocument();
  });

  it('makes the schedule id read-only, since it cannot be changed', () => {
    setup();

    expect(mockCreateForm).toHaveBeenCalledWith(
      expect.objectContaining({ scheduleIdReadOnly: true })
    );
  });

  it('does not pre-select worker SDK, since schedules do not persist it', () => {
    setup();

    expect(mockCreateForm).toHaveBeenCalledWith(
      expect.objectContaining({ prefillWorkerSDKLanguage: false })
    );
  });

  it('forwards the domain, cluster and form handles', () => {
    setup();

    expect(mockCreateForm).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        control: expect.any(Object),
        trigger: expect.any(Function),
        clearErrors: expect.any(Function),
      })
    );
  });
});

function setup() {
  function Wrapper() {
    const { control, trigger, clearErrors } = useForm<EditScheduleFormData>();

    return (
      <ScheduleActionEditForm
        control={control}
        trigger={trigger}
        clearErrors={clearErrors}
        domain="mock-domain"
        cluster="mock-cluster"
      />
    );
  }

  render(<Wrapper />);
}
