import React from 'react';

import { get } from 'lodash';
import { useForm } from 'react-hook-form';

import { fireEvent, render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionStartOptionalSection from '../workflow-action-start-optional-section';
import { type Props } from '../workflow-action-start-optional-section.types';

jest.mock(
  '../../workflow-action-start-retry-policy/workflow-action-start-retry-policy',
  () =>
    jest.fn(() => {
      return <div>Retry Policy Fields</div>;
    })
);

describe('WorkflowActionStartForm', () => {
  it('displays error when form has errors', async () => {
    const formErrors = {
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
    };

    const { user } = await setup({
      getFieldErrorMessages: (key) => get(formErrors, key)?.message,
    });

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
  });

  it('toggles content onClick', async () => {
    const { user } = await setup({});

    const toggleButton = screen.getByRole('button', {
      name: /Show Optional Configurations/i,
    });

    await user.click(toggleButton);

    expect(toggleButton).toHaveTextContent('Hide Optional Configurations');
    await user.click(toggleButton);

    expect(toggleButton).toHaveTextContent('Show Optional Configurations');
  });

  it('handles fields changes', async () => {
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
  formData: Props['formData'];
  getFieldErrorMessages: Props['getFieldErrorMessages'];
};

function TestWrapper({ formData, getFieldErrorMessages }: TestProps) {
  const methods = useForm<Props['formData']>({
    defaultValues: formData,
  });

  return (
    <WorkflowActionStartOptionalSection
      control={methods.control}
      clearErrors={methods.clearErrors}
      formData={formData}
      getFieldErrorMessages={getFieldErrorMessages}
    />
  );
}

async function setup({
  formData = {
    taskList: { name: '' },
    workflowType: { name: '' },
    workerSDKLanguage: 'GO',
    executionStartToCloseTimeoutSeconds: 0,
    scheduleType: 'NOW',
    input: [''],

    enableRetryPolicy: false,
    retryPolicy: undefined,
  },
  getFieldErrorMessages = () => undefined,
}: Partial<TestProps>) {
  const user = userEvent.setup();

  render(
    <TestWrapper
      formData={formData}
      getFieldErrorMessages={getFieldErrorMessages}
    />
  );

  return { user };
}
