import { useEffect, useState } from 'react';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Banner } from 'baseui/banner';
import { Button } from 'baseui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MdRefresh,
  MdOpenInNew,
  MdChevronRight,
  MdExpandMore,
} from 'react-icons/md';

import errorIcon from '@/assets/error-icon.svg';
import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import logger from '@/utils/logger';

import { styled, overrides } from './error-panel.styles';
import { type Props } from './error-panel.types';

export default function ErrorPanel({
  showErrorDetails = false,
  ...props
}: Props) {
  const router = useRouter();
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary();

  const [isErrorExpanded, setIsErrorExpanded] = useState(false);

  useEffect(() => {
    if (props.error && !props.omitLogging) {
      logger.error(props.error, props.message);
    }
  }, [props.error, props.message, props.omitLogging]);

  return (
    <styled.ErrorContainer>
      <Image width={64} height={64} alt="Error" src={errorIcon} />
      <styled.ErrorText>{props.message}</styled.ErrorText>
      {props.description && (
        <styled.ErrorDescription>{props.description}</styled.ErrorDescription>
      )}
      {showErrorDetails && props.error?.message && (
        <Banner kind="negative" hierarchy="low" overrides={overrides.banner}>
          <styled.ErrorMessageToggle
            onClick={() => setIsErrorExpanded((v) => !v)}
            aria-expanded={isErrorExpanded}
            aria-label="Toggle error message"
          >
            {isErrorExpanded ? (
              <MdExpandMore size={16} />
            ) : (
              <MdChevronRight size={16} />
            )}
            Error message
          </styled.ErrorMessageToggle>
          {isErrorExpanded && (
            <styled.ErrorMessageContainer>
              <styled.ErrorMessageText>
                {props.error.message}
              </styled.ErrorMessageText>
              <styled.ErrorCopyButtonContainer>
                <CopyTextButton textToCopy={props.error.message} />
              </styled.ErrorCopyButtonContainer>
            </styled.ErrorMessageContainer>
          )}
        </Banner>
      )}
      {props.actions && (
        <styled.ErrorActionsContainer>
          {props.actions.map((action) => {
            let startEnhancer;
            if (action.startEnhancer) {
              startEnhancer = action.startEnhancer;
            } else if (action.kind === 'retry') {
              startEnhancer = MdRefresh;
            }

            let endEnhancer;
            if (action.endEnhancer) {
              endEnhancer = action.endEnhancer;
            } else if (action.kind === 'link-external') {
              endEnhancer = MdOpenInNew;
            }

            return (
              <Button
                key={action.label}
                size="compact"
                kind={action.buttonKind ?? 'secondary'}
                shape={action.shape ?? 'pill'}
                onClick={() => {
                  switch (action.kind) {
                    case 'retry':
                      resetQueryErrors();
                      router.refresh();
                      props.reset?.();
                      break;
                    case 'link-internal':
                      router.push(action.link);
                      break;
                    case 'link-external':
                      window.open(action.link);
                      break;
                    case 'callback':
                      action.onClick();
                      break;
                  }
                }}
                startEnhancer={startEnhancer}
                endEnhancer={endEnhancer}
              >
                {action.label}
              </Button>
            );
          })}
        </styled.ErrorActionsContainer>
      )}
    </styled.ErrorContainer>
  );
}
