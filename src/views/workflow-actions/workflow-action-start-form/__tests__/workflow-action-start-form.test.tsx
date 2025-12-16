import React from 'react';

import { type FieldErrors, useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionStartForm from '../workflow-action-start-form';
import { type StartWorkflowFormData } from '../workflow-action-start-form.types';

jest.mock(
  '../../workflow-action-start-optional-section/workflow-action-start-optional-section',
  () =>
    jest.fn(() => {
      return <div>Optional Section Fields</div>;
    })
);

describe('WorkflowActionStartForm', () => {
  it('renders essential form fields', async () => {
    await setup({});

    expect(
      screen.getByRole('textbox', { name: 'Task List' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Workflow Type' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', {
        name: 'Execution Start to Close Timeout',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: 'Worker SDK' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: 'Schedule Time' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'JSON input arguments (optional)' })
    ).toBeInTheDocument();
  });

  it('displays error when form has errors', async () => {
    const formErrors = {
      'taskList.name': {
        message: 'Task list name is required',
        type: 'required',
      },
      'workflowType.name': {
        message: 'Workflow type name is required',
        type: 'required',
      },
      executionStartToCloseTimeoutSeconds: {
        message: 'Timeout is required',
        type: 'required',
      },
      input: [
        {
          message: 'Invalid JSON format',
          type: 'invalid',
        },
      ],
      firstRunAt: {
        message: 'Run at is required',
        type: 'required',
      },
      cronSchedule: {
        message: 'Cron schedule is required',
        type: 'required',
      },
    };

    const { user } = await setup({ formErrors });

    const taskListInput = screen.getByRole('textbox', {
      name: 'Task List',
    });
    expect(taskListInput).toHaveAttribute('aria-invalid', 'true');

    const workflowTypeInput = screen.getByRole('textbox', {
      name: 'Workflow Type',
    });
    expect(workflowTypeInput).toHaveAttribute('aria-invalid', 'true');

    const timeoutInput = screen.getByRole('spinbutton', {
      name: 'Execution Start to Close Timeout',
    });
    expect(timeoutInput).toHaveAttribute('aria-invalid', 'true');

    const inputArgumentsTextarea = screen.getByRole('textbox', {
      name: 'JSON input arguments (optional)',
    });
    expect(inputArgumentsTextarea).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('radio', { name: 'Later' }));
    expect(screen.getByRole('textbox', { name: 'Run At' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    await user.click(screen.getByRole('radio', { name: 'Cron' }));
    expect(screen.getByLabelText('Minute')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Hour')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Day of Month')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Month')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Day of Week')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('handles input changes correctly', async () => {
    const { user } = await setup({});

    const taskListInput = screen.getByRole('textbox', {
      name: 'Task List',
    });
    await user.type(taskListInput, 'test-task-list');
    expect(taskListInput).toHaveValue('test-task-list');

    const workflowTypeInput = screen.getByRole('textbox', {
      name: 'Workflow Type',
    });
    await user.type(workflowTypeInput, 'test-workflow-type');
    expect(workflowTypeInput).toHaveValue('test-workflow-type');

    const timeoutInput = screen.getByRole('spinbutton', {
      name: 'Execution Start to Close Timeout',
    });
    await user.type(timeoutInput, '300');
    expect(timeoutInput).toHaveValue(300);
  });

  it('renders with default values', async () => {
    await setup({});

    const laterRadio = screen.getByRole('radio', { name: 'Now' });
    expect(laterRadio).toBeChecked();

    const goRadio = screen.getByRole('radio', { name: 'GO' });
    expect(goRadio).toBeChecked();
  });

  it('shows schedule time options', async () => {
    await setup({});

    expect(screen.getByText('Now')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
    expect(screen.getByText('Cron')).toBeInTheDocument();
  });

  it('switches between schedule types and shows conditional fields', async () => {
    const { user } = await setup({});

    // Test switching to Later
    const laterRadio = screen.getByRole('radio', { name: 'Later' });
    await user.click(laterRadio);

    expect(screen.getByText('Run At')).toBeInTheDocument();

    // Test switching to Cron
    const cronRadio = screen.getByRole('radio', { name: 'Cron' });
    await user.click(cronRadio);

    expect(screen.queryByText('Run At')).not.toBeInTheDocument();
    expect(screen.getByText('Cron Schedule (UTC)')).toBeInTheDocument();

    // Test switching back to Now
    const nowRadio = screen.getByRole('radio', { name: 'Now' });
    await user.click(nowRadio);

    expect(screen.queryByText('Run At')).not.toBeInTheDocument();
    expect(screen.queryByText('Cron Schedule (UTC)')).not.toBeInTheDocument();
  });

  it('handles worker SDK language selection', async () => {
    const { user } = await setup({});

    // Find and click on a different SDK language
    const javaRadio = screen.getByRole('radio', { name: 'JAVA' });
    await user.click(javaRadio);
    expect(javaRadio).toBeChecked();

    const goRadio = screen.getByRole('radio', { name: 'GO' });
    await user.click(goRadio);
    expect(goRadio).toBeChecked();
  });

  it('shows optional section fields component', async () => {
    await setup({});

    expect(screen.getByText('Optional Section Fields')).toBeInTheDocument();
  });
});

type TestProps = {
  formErrors: FieldErrors<StartWorkflowFormData>;
  formData: StartWorkflowFormData;
};

function TestWrapper({ formErrors, formData }: TestProps) {
  const methods = useForm<StartWorkflowFormData>({
    defaultValues: formData,
  });

  return (
    <WorkflowActionStartForm
      trigger={methods.trigger}
      control={methods.control}
      clearErrors={methods.clearErrors}
      fieldErrors={formErrors}
      formData={formData}
      cluster="test-cluster"
      domain="test-domain"
      workflowId="test-workflow-id"
      runId="test-run-id"
    />
  );
}

async function setup({
  formErrors = {},
  formData = {
    taskList: { name: '' },
    workflowType: { name: '' },
    workerSDKLanguage: 'GO',
    executionStartToCloseTimeoutSeconds: 0,
    scheduleType: 'NOW',
    input: [''],
  },
}: Partial<TestProps>) {
  const user = userEvent.setup();

  render(<TestWrapper formErrors={formErrors} formData={formData} />);

  return { user };
}
