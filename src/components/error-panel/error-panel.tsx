import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Button, SIZE, KIND, SHAPE } from 'baseui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdRefresh, MdOpenInNew } from 'react-icons/md';

import errorIcon from '@/assets/error-icon.svg';

import { styled } from './error-panel.styles';
import { type Props } from './error-panel.types';

export default function ErrorPanel(props: Props) {
  const router = useRouter();
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary();

  return (
    <styled.ErrorContainer>
      <Image width={64} height={64} alt="Error" src={errorIcon} />
      <styled.ErrorText>{props.message}</styled.ErrorText>
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
                    props.reset();
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
