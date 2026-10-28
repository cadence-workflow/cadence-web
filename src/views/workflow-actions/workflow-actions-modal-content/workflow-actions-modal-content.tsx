import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { KIND as BUTTON_KIND, SIZE } from 'baseui/button';
import { ModalButton } from 'baseui/modal';
import { useSnackbar } from 'baseui/snackbar';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline, MdOpenInNew } from 'react-icons/md';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import ActionModalForm from '@/views/shared/action-modal-form/action-modal-form';

import { type WorkflowActionInput } from '../workflow-actions.types';

import { overrides, styled } from './workflow-actions-modal-content.styles';
import { type Props } from './workflow-actions-modal-content.types';

export default function WorkflowActionsModalContent<
  Result,
  FormData extends FieldValues,
  SubmissionData,
>({
  action,
  params,
  onCloseModal,
  initialFormValues,
}: Props<Result, FormData, SubmissionData>) {
  const queryClient = useQueryClient();
  const { enqueue, dequeue } = useSnackbar();

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
        request(action.apiRoute({ domain, cluster, workflowId, runId }), {
          method: 'POST',
          body: JSON.stringify(submissionData || {}),
        }).then((res) => res.json() as Result),
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
    if (!action.modal.withForm) return;
    mutate({
      ...params,
      submissionData: action.modal.transformFormDataToSubmission(data),
    });
  };

  const onConfirm = () => {
    mutate({ ...params, submissionData: undefined as SubmissionData });
  };

  const modalText = Array.isArray(action.modal.text) ? (
    action.modal.text.map((text, index) => <p key={index}>{text}</p>)
  ) : (
    <p>{action.modal.text}</p>
  );

  const Form = action.modal.form;
  const renderContent = (form?: UseFormReturn<FormData>) => (
    <>
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
        {action.modal.withForm && Form && form && (
          <Form
            formData={form.watch()}
            fieldErrors={form.formState.errors}
            clearErrors={form.clearErrors}
            control={form.control}
            trigger={form.trigger}
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
          isLoading={isPending || form?.formState.isSubmitting}
          disabled={Object.keys(form?.formState.errors ?? {}).length > 0}
        >
          {action.label} workflow
        </ModalButton>
      </styled.ModalFooter>
    </>
  );

  return (
    <>
      <styled.ModalHeader>{action.label} workflow</styled.ModalHeader>
      <ActionModalForm
        schema={action.modal.formSchema}
        initialFormValues={initialFormValues}
        onSubmit={onSubmit}
        onConfirm={onConfirm}
      >
        {renderContent}
      </ActionModalForm>
    </>
  );
}
