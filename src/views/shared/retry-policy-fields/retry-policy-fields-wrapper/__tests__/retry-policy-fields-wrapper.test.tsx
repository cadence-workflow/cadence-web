import { Input } from 'baseui/input';

import { render, screen } from '@/test-utils/rtl';

import RetryPolicyFieldsWrapper from '../retry-policy-fields-wrapper';
import {
  type FieldComponentProps,
  type Props,
} from '../retry-policy-fields-wrapper.types';

describe(RetryPolicyFieldsWrapper.name, () => {
  it('uses FormControl by default', () => {
    setup({ error: 'Invalid value' });

    expect(screen.getByText('Retry interval')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('passes field props to a custom component', () => {
    setup({
      fieldComponent: TestField,
      description: 'Time before the first retry',
      htmlFor: 'retry-interval',
      error: 'Invalid value',
      subfield: true,
    });

    expect(screen.getByLabelText('Retry interval')).toBeInTheDocument();
    expect(screen.getByText('Time before the first retry')).toBeInTheDocument();
    expect(screen.getByText('Invalid value')).toBeInTheDocument();
    expect(screen.getByTestId('test-field')).toHaveAttribute(
      'data-subfield',
      'true'
    );
  });
});

function TestField({
  label,
  description,
  htmlFor,
  error,
  subfield,
  children,
}: FieldComponentProps) {
  return (
    <div data-testid="test-field" data-subfield={subfield}>
      <label htmlFor={htmlFor}>{label}</label>
      <span>{description}</span>
      <span>{error}</span>
      {children}
    </div>
  );
}

function setup(props: Partial<Props> = {}) {
  render(
    <RetryPolicyFieldsWrapper label="Retry interval" {...props}>
      <Input id="retry-interval" type="number" />
    </RetryPolicyFieldsWrapper>
  );
}
