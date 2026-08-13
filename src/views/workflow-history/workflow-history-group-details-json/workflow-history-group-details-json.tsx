'use client';
import React, { useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { Modal, ModalButton } from 'baseui/modal';
import { MdCopyAll, MdOpenInFull } from 'react-icons/md';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import {
  overrides,
  styled,
} from './workflow-history-group-details-json.styles';
import { type Props } from './workflow-history-group-details-json.types';

export default function WorkflowHistoryGroupDetailsJson({
  entryPath,
  entryValue,
  isNegative,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(entryValue, null, '\t');
  }, [entryValue]);

  return (
    <>
      <styled.ViewerContainer $isNegative={isNegative ?? false}>
        <styled.ViewerHeader>
          <styled.ViewerLabel $isNegative={isNegative ?? false}>
            {entryPath}
          </styled.ViewerLabel>
          <styled.ButtonsContainer>
            <Button
              size="mini"
              kind="secondary"
              shape="pill"
              overrides={overrides.actionButton}
              onClick={() => setIsOpen((v) => !v)}
            >
              <MdOpenInFull size={16} />
            </Button>
            <CopyTextButton
              textToCopy={textToCopy}
              overrides={overrides.actionButton}
            >
              <MdCopyAll size={16} />
            </CopyTextButton>
          </styled.ButtonsContainer>
        </styled.ViewerHeader>
        <styled.JsonContainer>
          <PrettyJson json={entryValue} />
        </styled.JsonContainer>
      </styled.ViewerContainer>
      <Modal
        size="auto"
        overrides={overrides.modal}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeable
      >
        <styled.ModalHeader>{entryPath}</styled.ModalHeader>
        <styled.ModalBody>
          <styled.ViewContainer>
            <PrettyJson json={entryValue as Record<string, any>} />
            <styled.ModalButtonsContainer>
              <CopyTextButton
                textToCopy={textToCopy}
                overrides={overrides.actionButton}
              >
                <MdCopyAll size={16} />
              </CopyTextButton>
            </styled.ModalButtonsContainer>
          </styled.ViewContainer>
        </styled.ModalBody>
        <styled.ModalFooter>
          <ModalButton
            size="compact"
            type="button"
            kind="primary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </ModalButton>
        </styled.ModalFooter>
      </Modal>
    </>
  );
}
