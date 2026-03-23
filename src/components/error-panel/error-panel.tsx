import { useEffect, useState } from 'react';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Banner } from 'baseui/banner';
import { Button, SIZE, KIND, SHAPE } from 'baseui/button';
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
          {props.actions.map((action) => (
            <Button
              key={action.label}
              size={SIZE.compact}
              kind={KIND.secondary}
              shape={SHAPE.pill}
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
                }
              }}
              {...(action.kind === 'retry' && { startEnhancer: MdRefresh })}
              {...(action.kind === 'link-external' && {
                endEnhancer: MdOpenInNew,
              })}
            >
              {action.label}
            </Button>
          ))}
        </styled.ErrorActionsContainer>
      )}
    </styled.ErrorContainer>
  );
}
