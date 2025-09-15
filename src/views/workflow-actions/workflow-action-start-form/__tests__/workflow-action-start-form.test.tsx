import React from 'react';

import { type FieldErrors, useForm } from 'react-hook-form';

import { fireEvent, render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionStartForm from '../workflow-action-start-form';
import { type StartWorkflowFormData } from '../workflow-action-start-form.types';

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
      header: {
        message: 'Invalid JSON format',
        type: 'invalid',
      },
      memo: {
        message: 'Invalid JSON format',
        type: 'invalid',
      },
      searchAttributes: {
        message: 'Invalid JSON format',
        type: 'invalid',
      },
      retryLimit: {
        message: 'Invalid limit',
        type: 'invalid',
      },
      retryPolicy: {
        initialIntervalSeconds: {
          message: 'Invalid initial interval',
          type: 'invalid',
        },
        backoffCoefficient: {
          message: 'Invalid backoff coefficient',
          type: 'invalid',
        },
        maximumAttempts: {
          message: 'Invalid maximum attempts',
          type: 'invalid',
        },
        expirationIntervalSeconds: {
          message: 'Invalid expiration interval',
          type: 'invalid',
        },
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
    expect(
      screen.getByRole('textbox', { name: 'Cron Schedule (UTC)' })
    ).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByText('Show Optional Configurations'));

    expect(screen.getByRole('textbox', { name: 'Header' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    expect(screen.getByRole('textbox', { name: 'Memo' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    expect(
      screen.getByRole('textbox', { name: 'Search Attributes' })
    ).toHaveAttribute('aria-invalid', 'true');

    await user.click(
      screen.getByRole('checkbox', { name: 'Enable Retry Policy' })
    );

    expect(
      screen.getByRole('spinbutton', { name: 'Initial Interval' })
    ).toHaveAttribute('aria-invalid', 'true');

    expect(
      screen.getByRole('spinbutton', { name: 'Backoff Coefficient' })
    ).toHaveAttribute('aria-invalid', 'true');

    expect(
      screen.getByRole('spinbutton', { name: 'Maximum Attempts' })
    ).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('radio', { name: 'Duration' }));
    expect(
      screen.getByRole('spinbutton', { name: 'Expiration Interval' })
    ).toHaveAttribute('aria-invalid', 'true');
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

  it('toggles optional configurations header onClick', async () => {
    const { user } = await setup({});

    const toggleButton = screen.getByRole('button', {
      name: /Show Optional Configurations/i,
    });

    await user.click(toggleButton);

    expect(toggleButton).toHaveTextContent('Hide Optional Configurations');
    await user.click(toggleButton);

    expect(toggleButton).toHaveTextContent('Show Optional Configurations');
  });

  it('toggles retry policy fields visibility', async () => {
    const { user } = await setup({});

    // Expand the optional configurations
    const toggleButton = screen.getByRole('button', {
      name: /Show Optional Configurations/i,
    });
    await user.click(toggleButton);

    // Initially retry policy fields should not be visible
    expect(screen.queryByLabelText('Initial Interval')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Backoff Coefficient')
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Maximum Interval')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Retries Limit')).not.toBeInTheDocument();

    // Enable retry policy
    const enableRetryCheckbox = screen.getByRole('checkbox', {
      name: /Enable retry policy/i,
    });
    await user.click(enableRetryCheckbox);

    // Now retry policy fields should be visible
    expect(screen.getByLabelText('Initial Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Backoff Coefficient')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Retries Limit')).toBeInTheDocument();
  });

  it('handles retry limit field changes', async () => {
    const { user } = await setup({});

    // Expand the optional configurations
    await user.click(
      screen.getByRole('button', {
        name: /Show Optional Configurations/i,
      })
    );
    // Enable retry policy
    await user.click(
      screen.getByRole('checkbox', { name: 'Enable Retry Policy' })
    );

    // Should show attempts field
    expect(screen.getByRole('radio', { name: 'Attempts' })).toBeChecked();
    expect(
      screen.getByRole('spinbutton', { name: 'Maximum Attempts' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('spinbutton', { name: 'Expiration Interval' })
    ).not.toBeInTheDocument();

    // Should show duration field
    await user.click(screen.getByRole('radio', { name: 'Duration' }));
    expect(screen.getByRole('radio', { name: 'Duration' })).toBeChecked();
    expect(
      screen.queryByRole('spinbutton', { name: 'Maximum Attempts' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Expiration Interval' })
    ).toBeInTheDocument();
  });

  it('handles optional configuration fields changes', async () => {
    const { user } = await setup({});

    // Expand the optional configurations
    const toggleButton = screen.getByRole('button', {
      name: /Show Optional Configurations/i,
    });
    await user.click(toggleButton);

    // Should change workflow id input
    const workflowIdInput = screen.getByLabelText('Workflow ID');
    await user.type(workflowIdInput, 'test-workflow-id');
    expect(workflowIdInput).toHaveValue('test-workflow-id');

    // Enable retry policy
    const enableRetryCheckbox = screen.getByRole('checkbox', {
      name: /Enable retry policy/i,
    });
    await user.click(enableRetryCheckbox);

    // Should show maximum interval input
    const maxIntervalInput = screen.getByLabelText('Maximum Interval');
    await user.type(maxIntervalInput, '30');
    expect(maxIntervalInput).toHaveValue(30);

    // Should show reuse policy dropdown
    const reusePolicyDropdown = screen.getByRole('combobox', {
      name: /Workflow ID Reuse Policy/i,
    });
    await user.click(reusePolicyDropdown);

    // Should change reuse policy
    const firstOption = screen.getByText('Allow Duplicate');
    await user.click(firstOption);
    expect(reusePolicyDropdown).toHaveAttribute(
      'aria-label',
      'Selected Allow Duplicate. Workflow ID Reuse Policy'
    );

    // Should change initial interval
    const initialIntervalInput = screen.getByLabelText('Initial Interval');
    await user.type(initialIntervalInput, '10');
    expect(initialIntervalInput).toHaveValue(10);

    // Should change backoff coefficient
    const backoffCoeffInput = screen.getByLabelText('Backoff Coefficient');
    await user.type(backoffCoeffInput, '2.0');
    expect(backoffCoeffInput).toHaveValue(2.0);

    // Should change header
    const headerInput = screen.getByLabelText('Header');
    // userEvent can have issues with typing { memo: 'test' } detail:https://stackoverflow.com/questions/76790750/ignore-braces-as-special-characters-in-userevent-type
    fireEvent.change(headerInput, {
      target: { value: JSON.stringify({ key: 'value' }) },
    });
    expect(headerInput).toHaveValue(JSON.stringify({ key: 'value' }));

    // Should change memo
    const memoInput = screen.getByLabelText('Memo');
    fireEvent.change(memoInput, {
      target: { value: JSON.stringify({ memo: 'test' }) },
    });
    expect(memoInput).toHaveValue(JSON.stringify({ memo: 'test' }));

    // Should change search attributes
    const searchAttributesInput = screen.getByLabelText('Search Attributes');
    fireEvent.change(searchAttributesInput, {
      target: { value: JSON.stringify({ attr: 'value' }) },
    });
    expect(searchAttributesInput).toHaveValue(
      JSON.stringify({ attr: 'value' })
    );
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
