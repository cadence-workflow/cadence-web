import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import {
  mockZodSchema,
  mockData,
  mockFormConfig,
} from '../__fixtures__/settings-form.fixtures';
import SettingsForm from '../settings-form';

describe(SettingsForm.name, () => {
  it('should render form correctly', () => {
    setup({});

    const formFields = screen.getAllByRole('textbox');
    expect(formFields).toHaveLength(3);

    expect(formFields[0]).toHaveValue('mock_data_A');
    expect(formFields[1]).toHaveValue('1234');
    expect(formFields[2]).toHaveValue('true');

    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveTextContent('Submit form');
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should accept form submission once any of the fields are modified', async () => {
    const { user, mockOnSubmit } = setup({});

    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveAttribute('disabled');

    const formFieldA = screen.getByDisplayValue('mock_data_A');

    await user.clear(formFieldA);
    await user.type(formFieldA, 'new_mock_data_A');

    expect(formFieldA).toHaveValue('new_mock_data_A');
    expect(submitButton).not.toHaveAttribute('disabled');

    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      {
        field1: 'new_mock_data_A',
        field2: 1234,
        field3: true,
      },
      expect.anything()
    );
  });

  it('should call onSubmitError if the call to submit fails', async () => {
    const { user, mockOnSubmit, mockOnSubmitError } = setup({});

    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveAttribute('disabled');

    const formFieldA = screen.getByDisplayValue('mock_data_A');

    await user.clear(formFieldA);
    await user.type(formFieldA, 'new_mock_data_A');

    expect(formFieldA).toHaveValue('new_mock_data_A');
    expect(submitButton).not.toHaveAttribute('disabled');

    mockOnSubmit.mockRejectedValueOnce('Test error case');
    await user.click(submitButton);

    expect(mockOnSubmitError).toHaveBeenCalled();
  });

  it('should disable submit button if a field is reset to original value', async () => {
    const { user } = setup({});

    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveAttribute('disabled');

    const formFieldA = screen.getByDisplayValue('mock_data_A');

    await user.clear(formFieldA);
    await user.type(formFieldA, 'new_mock_data_A');

    expect(formFieldA).toHaveValue('new_mock_data_A');
    expect(submitButton).not.toHaveAttribute('disabled');

    await user.clear(formFieldA);
    await user.type(formFieldA, 'mock_data_A');

    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should show an error and disable submit if a field has an invalid value', async () => {
    const { user } = setup({});

    const formFieldC = screen.getByDisplayValue('true');

    await user.clear(formFieldC);
    await user.type(formFieldC, 'definitely_not_a_boolean');

    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    expect(submitButton).toHaveAttribute('disabled');

    expect(formFieldC).toHaveAttribute(
      'error',
      'Expected boolean, received string'
    );

    expect(
      screen.getByText('Expected boolean, received string')
    ).toBeInTheDocument();
  });
});

function setup({}) {
  const user = userEvent.setup();
  const mockOnSubmit = jest.fn();
  const mockOnSubmitError = jest.fn();

  render(
    <SettingsForm
      data={mockData}
      zodSchema={mockZodSchema}
      formConfig={mockFormConfig}
      onSubmit={mockOnSubmit}
      submitButtonText="Submit form"
      onSubmitError={mockOnSubmitError}
    />
  );

  return { user, mockOnSubmit, mockOnSubmitError };
}
