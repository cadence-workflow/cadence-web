import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Textarea } from 'baseui/textarea';
import { Controller } from 'react-hook-form';

import { type WorkflowActionFormProps } from '../workflow-actions.types';

import { overrides } from './workflow-action-signal-form.styles';
import { type SignalWorkflowFormData } from './workflow-action-signal-form.types';

export default function WorkflowActionSignalForm({
  fieldErrors,
  control,
}: WorkflowActionFormProps<SignalWorkflowFormData>) {
  const getErrorMessage = (field: string) => {
    return field in fieldErrors
      ? fieldErrors[field as keyof typeof fieldErrors]?.message
      : undefined;
  };

  return (
    <div>
      <FormControl label="Signal Name">
        <Controller
          name="signalName"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              size="compact"
              onBlur={field.onBlur}
              error={Boolean(getErrorMessage('signalName'))}
              placeholder="Enter signal name"
            />
          )}
        />
      </FormControl>
      <FormControl label="JSON Input (optional)">
        <Controller
          name="signalInput"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Textarea
              {...field}
              overrides={overrides.jsonInput}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              size="compact"
              onBlur={field.onBlur}
              error={Boolean(getErrorMessage('signalInput'))}
              placeholder="Enter JSON input"
            />
          )}
        />
      </FormControl>
    </div>
  );
}
