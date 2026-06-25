import React, { useEffect } from 'react';

import { useForm, type FieldPath } from 'react-hook-form';

import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/test-utils/rtl';

import { type DomainSchedulesCreateFormData } from '../../domain-schedules-create-modal/domain-schedules-create-modal.types';
import DomainSchedulesCreateForm from '../domain-schedules-create-form';

/** Required fields rendered by `DomainSchedulesCreateForm` (excludes optional input / pause / prefix / SDK default). */
const REQUIRED_FORM_FIELD_PATHS: FieldPath<DomainSchedulesCreateFormData>[] = [
  'workflowType.name',
  'taskList.name',
  'executionStartToCloseTimeoutSeconds',
  'taskStartToCloseTimeoutSeconds',
  'cronExpression',
  'input',
];

describe('DomainSchedulesCreateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields', async () => {
    await setup({});

    expect(
      screen.getByRole('textbox', { name: 'Workflow Type' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Task List' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', {
        name: 'Execution Start-to-Close Timeout',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', {
        name: 'Task Start-to-Close Timeout',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: 'Worker SDK' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'JSON input arguments (optional)' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Minute')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Enable pause on failure' })
    ).toBeInTheDocument();
  });

  it('displays field errors wired from react-hook-form state', async () => {
    await setup({ injectFieldErrors: true });

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'Workflow Type' })
      ).toHaveAttribute('aria-invalid', 'true');
    });

    expect(screen.getByRole('textbox', { name: 'Task List' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    expect(
      screen.getByRole('spinbutton', {
        name: 'Execution Start-to-Close Timeout',
      })
    ).toHaveAttribute('aria-invalid', 'true');

    expect(
      screen.getByRole('spinbutton', {
        name: 'Task Start-to-Close Timeout',
      })
    ).toHaveAttribute('aria-invalid', 'true');

    expect(screen.getByLabelText('Minute')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('handles text & number input changes correctly', async () => {
    const { user } = await setup({});

    const taskListInput = screen.getByRole('textbox', { name: 'Task List' });
    fireEvent.change(taskListInput, {
      target: { value: '  spaced-task-list  ' },
    });
    expect(taskListInput).toHaveValue('spaced-task-list');

    const workflowTypeInput = screen.getByRole('textbox', {
      name: 'Workflow Type',
    });
    await user.clear(workflowTypeInput);
    await user.type(workflowTypeInput, 'my-workflow');
    expect(workflowTypeInput).toHaveValue('my-workflow');

    const executionTimeout = screen.getByRole('spinbutton', {
      name: 'Execution Start-to-Close Timeout',
    });
    fireEvent.change(executionTimeout, { target: { value: '400' } });
    expect(executionTimeout).toHaveValue(400);

    const taskTimeout = screen.getByRole('spinbutton', {
      name: 'Task Start-to-Close Timeout',
    });
    fireEvent.change(taskTimeout, { target: { value: '90' } });
    expect(taskTimeout).toHaveValue(90);
  });

  it('renders with default worker SDK and pause-on-failure defaults', async () => {
    await setup({});

    expect(screen.getByRole('radio', { name: 'GO' })).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Enable pause on failure' })
    ).not.toBeChecked();
  });

  it('handles worker SDK language selection', async () => {
    const { user } = await setup({});

    const javaRadio = screen.getByRole('radio', { name: 'JAVA' });
    await user.click(javaRadio);
    expect(javaRadio).toBeChecked();

    const goRadio = screen.getByRole('radio', { name: 'GO' });
    await user.click(goRadio);
    expect(goRadio).toBeChecked();
  });

  it('toggles pause on failure', async () => {
    const { user } = await setup({});

    const checkbox = screen.getByRole('checkbox', {
      name: 'Enable pause on failure',
    });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});

type SetupProps = {
  defaultValues?: Partial<DomainSchedulesCreateFormData>;
  /** Applies fixed `setError` calls (same role as passing `fieldErrors` into start form tests). */
  injectFieldErrors?: boolean;
};

function TestWrapper({
  defaultValues,
  injectFieldErrors,
}: {
  defaultValues?: Partial<DomainSchedulesCreateFormData>;
  injectFieldErrors?: boolean;
}) {
  const { control, trigger, setError, clearErrors } = useForm<DomainSchedulesCreateFormData>(
    {
      defaultValues: { ...defaultValues },
      mode: 'onSubmit',
    }
  );

  useEffect(() => {
    if (!injectFieldErrors) return;
    for (const path of REQUIRED_FORM_FIELD_PATHS) {
      setError(path, { type: 'required', message: 'is required' });
    }
  }, [injectFieldErrors, setError]);

  return (
    <DomainSchedulesCreateForm
      control={control}
      trigger={trigger}
      clearErrors={clearErrors}
      cluster="test-cluster"
    />
  );
}

async function setup({
  defaultValues,
  injectFieldErrors = false,
}: Partial<SetupProps> = {}) {
  const user = userEvent.setup();

  render(
    <TestWrapper
      defaultValues={defaultValues}
      injectFieldErrors={injectFieldErrors}
    />
  );

  return { user };
}
