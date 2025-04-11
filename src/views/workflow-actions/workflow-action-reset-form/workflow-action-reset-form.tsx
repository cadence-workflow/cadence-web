import {
  Checkbox,
  STYLE_TYPE as CHECKBOX_STYLE_TYPE,
  LABEL_PLACEMENT as CHECKBOX_LABEL_PLACEMENT,
} from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Textarea } from 'baseui/textarea';
import { Controller } from 'react-hook-form';

import { type Props } from './workflow-action-reset-form.types';

export default function WorkflowActionResetForm({
  fieldErrors,
  control,
}: Props) {
  return (
    <div>
      <FormControl label="Event ID">
        <Controller
          name="decisionFinishEventId"
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
              onBlur={field.onBlur}
              error={Boolean(fieldErrors.decisionFinishEventId?.message)}
              type="number"
              placeholder="Find Event ID"
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="skipSignalReapply"
          control={control}
          defaultValue={false}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <Checkbox
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              checkmarkType={CHECKBOX_STYLE_TYPE.toggle_round}
              labelPlacement={CHECKBOX_LABEL_PLACEMENT.right}
              checked={value}
              error={Boolean(fieldErrors.skipSignalReapply?.message)}
              onChange={(e) => onChange(e.currentTarget.checked)}
            >
              Skip signal re-apply
            </Checkbox>
          )}
        />
      </FormControl>

      <FormControl label="Reason">
        <Controller
          name="reason"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <Textarea
              {...field}
              // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
              inputRef={ref}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={field.onBlur}
              error={Boolean(fieldErrors.reason?.message)}
              placeholder="Enter reason for reset"
            />
          )}
        />
      </FormControl>
    </div>
  );
}
