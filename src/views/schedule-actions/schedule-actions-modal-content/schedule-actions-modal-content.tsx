import { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { KIND as BUTTON_KIND, SIZE } from 'baseui/button';
import { ModalButton } from 'baseui/modal';
import { useSnackbar } from 'baseui/snackbar';
import { useRouter } from 'next/navigation';
import { type DefaultValues, type FieldValues, useForm } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type ScheduleActionInput } from '../schedule-actions.types';

import { overrides, styled } from './schedule-actions-modal-content.styles';
import { type Props } from './schedule-actions-modal-content.types';

export default function ScheduleActionsModalContent<
  Result,
  FormData,
  SubmissionData,
>({
  action,
  params,
  schedule,
  onCloseModal,
  initialFormValues,
}: Props<Result, FormData, SubmissionData>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { enqueue, dequeue } = useSnackbar();
  const errorAlertRef = useRef<HTMLDivElement>(null);

  type OptionalFormData = FormData extends FieldValues ? FormData : FieldValues;

  const {
    handleSubmit,
    formState: { errors: validationErrors, isSubmitting, isSubmitted },
    control,
    clearErrors,
    trigger,
  } = useForm<OptionalFormData>({
    resolver: action.modal.formSchema
      ? zodResolver(action.modal.formSchema)
      : undefined,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: initialFormValues as DefaultValues<OptionalFormData>,
  });

  const { mutate, isPending, error } = useMutation<
    Result,
    RequestError,
    ScheduleActionInput<SubmissionData>
  >(
    {
      mutationFn: ({
        domain,
        cluster,
        scheduleId,
        submissionData,
      }: ScheduleActionInput<SubmissionData>) => {
        const httpMethod = action.httpMethod ?? 'POST';

        return request(action.apiRoute({ domain, cluster, scheduleId }), {
          method: httpMethod,
          body: JSON.stringify(submissionData ?? {}),
        }).then((res) => res.json() as Result);
      },
      onSuccess: (result, mutationParams) => {
        queryClient.invalidateQueries({
          queryKey: ['describeSchedule', params],
        });

        action.onSuccess?.({ queryClient, params, router });

        onCloseModal();
        enqueue({
          message: action.renderSuccessMessage?.({
            result,
            inputParams: mutationParams,
            onDismissMessage: () => dequeue(),
          }),
          startEnhancer: MdCheckCircle,
          actionMessage: 'OK',
          actionOnClick: () => dequeue(),
        });
      },
    },
    queryClient
  );

  useEffect(() => {
    if (error) {
      errorAlertRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [error]);

  const onSubmit = (data: OptionalFormData) => {
    mutate({
      ...params,
      submissionData: action.modal.withForm
        ? action.modal.transformFormDataToSubmission(data as FormData)
        : action.getConfirmSubmissionData?.() ?? (undefined as SubmissionData),
    });
  };

  const Form = action.modal.form;
  const isSubmitDisabled = Object.keys(validationErrors).length > 0;

  const modalBanner = action.modal.banner ? (
    <Banner
      hierarchy={HIERARCHY.low}
      kind={action.modal.banner.kind}
      overrides={overrides.banner}
      artwork={{
        icon: action.modal.banner.icon,
      }}
    >
      {action.modal.banner.render(schedule)}
    </Banner>
  ) : null;

  return (
    <>
      <styled.ModalHeader>{`${action.label} schedule`}</styled.ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <styled.ModalBody>
          {modalBanner}
          {error && (
            <div ref={errorAlertRef} role="alert">
              <Banner
                hierarchy={HIERARCHY.low}
                kind={BANNER_KIND.negative}
                overrides={overrides.banner}
                artwork={{
                  icon: MdErrorOutline,
                }}
              >
                {error.message}
              </Banner>
            </div>
          )}
          <styled.ModalBodyContent>
            {action.modal.withForm && Form && (
              <Form
                fieldErrors={validationErrors}
                clearErrors={clearErrors}
                control={control}
                trigger={trigger}
                cluster={params.cluster}
                domain={params.domain}
                scheduleId={params.scheduleId}
                isSubmitted={isSubmitted}
              />
            )}
          </styled.ModalBodyContent>
        </styled.ModalBody>
        <styled.ModalFooter>
          <ModalButton
            autoFocus={!action.modal.withForm}
            size={SIZE.compact}
            type="button"
            kind={BUTTON_KIND.secondary}
            onClick={onCloseModal}
          >
            Cancel
          </ModalButton>
          <ModalButton
            size={SIZE.compact}
            kind={BUTTON_KIND.primary}
            type="submit"
            isLoading={isPending || isSubmitting}
            disabled={isSubmitDisabled}
          >
            {`${action.label} schedule`}
          </ModalButton>
        </styled.ModalFooter>
      </form>
    </>
  );
}
