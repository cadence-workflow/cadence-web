import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { KIND as BUTTON_KIND, SIZE } from 'baseui/button';
import { ModalButton } from 'baseui/modal';
import { useSnackbar } from 'baseui/snackbar';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type WorkflowActionInputParams } from '../workflow-actions.types';

import { overrides, styled } from './workflow-actions-modal-content.styles';
import { type Props } from './workflow-actions-modal-content.types';

export default function WorkflowActionsModalContent<R>({
  action,
  params,
  onCloseModal,
}: Props<R>) {
  const queryClient = useQueryClient();
  const { enqueue, dequeue } = useSnackbar();
  const { mutate, isPending, error } = useMutation<
    R,
    RequestError,
    WorkflowActionInputParams
  >(
    {
      mutationFn: ({
        domain,
        cluster,
        workflowId,
        runId,
      }: WorkflowActionInputParams) =>
        request(
          `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/${action.apiRoute}`,
          {
            method: 'POST',
            body: JSON.stringify({
              // TODO: pass the input here when implementing extended workflow actions
            }),
          }
        ).then((res) => res.json() as R),
      onSuccess: (result, params) => {
        const {
          // TODO: input,
          ...workflowDetailsParams
        } = params;

        queryClient.invalidateQueries({
          queryKey: ['describe_workflow', workflowDetailsParams],
        });

        onCloseModal();
        enqueue({
          message: action.getSuccessMessage(result, params),
          startEnhancer: MdCheckCircle,
          actionMessage: 'OK',
          actionOnClick: () => dequeue(),
        });
      },
    },
    queryClient
  );

  return (
    <>
      <styled.ModalHeader>{action.label} workflow</styled.ModalHeader>
      <styled.ModalBody>
        {action.subtitle}
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
          size={SIZE.compact}
          kind={BUTTON_KIND.secondary}
          onClick={onCloseModal}
        >
          Go back
        </ModalButton>
        <ModalButton
          size={SIZE.compact}
          kind={BUTTON_KIND.primary}
          onClick={() => mutate(params)}
          isLoading={isPending}
        >
          {action.label} workflow
        </ModalButton>
      </styled.ModalFooter>
    </>
  );
}
