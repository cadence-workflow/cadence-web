import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { KIND as BUTTON_KIND, SIZE } from 'baseui/button';
import { ModalButton } from 'baseui/modal';
import { useSnackbar } from 'baseui/snackbar';
import { type DefaultValues, type FieldValues, useForm } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline, MdOpenInNew } from 'react-icons/md';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type WorkflowActionInput } from '../workflow-actions.types';

import { overrides, styled } from './workflow-actions-modal-content.styles';
import { type Props } from './workflow-actions-modal-content.types';

export default function WorkflowActionsModalContent<
  Result,
  FormData,
  SubmissionData,
>({
  action,
  params,
  onCloseModal,
  initialFormValues,
}: Props<Result, FormData, SubmissionData>) {
  const queryClient = useQueryClient();
  const { enqueue, dequeue } = useSnackbar();

  // useForm doesn't accept form data that is not a FieldValues (e.g. undefined)
  type OptionalFormData = FormData extends FieldValues ? FormData : any;

  const {
    handleSubmit,
    formState: { errors: validationErrors, isSubmitting },
    control,
    watch,
  } = useForm<OptionalFormData>({
    resolver: action.modal.formSchema
      ? zodResolver(action.modal.formSchema)
      : undefined,
    defaultValues: initialFormValues as DefaultValues<OptionalFormData>,
  });

  const { mutate, isPending, error } = useMutation<
    Result,
    RequestError,
    WorkflowActionInput<SubmissionData>
  >(
    {
      mutationFn: ({
        domain,
        cluster,
        workflowId,
        runId,
        submissionData,
      }: WorkflowActionInput<SubmissionData>) =>
        request(
          `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/${action.apiRoute}`,
          {
            method: 'POST',
            body: JSON.stringify(submissionData || {}),
          }
        ).then((res) => res.json() as Result),
      onSuccess: (result, params) => {
        queryClient.invalidateQueries({
          queryKey: ['describe_workflow', params],
        });

        onCloseModal();
        enqueue({
          message: action.renderSuccessMessage?.({
            result,
            inputParams: params,
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

  const onSubmit = (data: FormData) => {
    mutate({
      ...params,
      submissionData: action.modal.withForm
        ? action.modal.transformFormDataToSubmission(data)
        : (undefined as SubmissionData),
    });
  };

  const modalText = Array.isArray(action.modal.text) ? (
    action.modal.text.map((text, index) => <p key={index}>{text}</p>)
  ) : (
    <p>{action.modal.text}</p>
  );

  const Form = action.modal.form;
  const isSubmitDisabled = Object.keys(validationErrors).length > 0;

  return (
    <>
      <styled.ModalHeader>{action.label} workflow</styled.ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <styled.ModalBody>
          {modalText}
          {action.modal.docsLink && (
            <styled.Link
              href={action.modal.docsLink.href}
              target="_blank"
              rel="noreferrer"
            >
              {action.modal.docsLink.text}
              <MdOpenInNew />
            </styled.Link>
          )}
          {action.modal.withForm && Form && (
            <Form
              formData={watch()}
              fieldErrors={validationErrors}
              control={control}
              cluster={params.cluster}
              domain={params.domain}
              workflowId={params.workflowId}
              runId={params.runId}
            />
          )}
          {error && (
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
          )}
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
            {action.label} workflow
          </ModalButton>
        </styled.ModalFooter>
      </form>
    </>
  );
}
