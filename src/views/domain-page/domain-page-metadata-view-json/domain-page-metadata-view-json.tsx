import { useMemo, useState } from 'react';

import {
  Button,
  KIND as BUTTON_KIND,
  SIZE as BUTTON_SIZE,
  SHAPE as BUTTON_SHAPE,
} from 'baseui/button';
import { Modal, SIZE as MODAL_SIZE, ModalButton } from 'baseui/modal';
import { MdCode, MdCopyAll, MdOutlineCloudDownload } from 'react-icons/md';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import downloadJson from '@/utils/download-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { styled, overrides } from './domain-page-metadata-view-json.styles';
import { type Props } from './domain-page-metadata-view-json.types';

export default function DomainPageMetadataViewJson(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(props.domainDescription, null, '\t');
  }, [props.domainDescription]);

  return (
    <>
      <Button
        size={BUTTON_SIZE.mini}
        kind={BUTTON_KIND.secondary}
        shape={BUTTON_SHAPE.pill}
        overrides={overrides.viewButton}
        startEnhancer={<MdCode size={20} />}
        onClick={() => setIsOpen((v) => !v)}
      >
        View JSON
      </Button>
      <Modal
        size={MODAL_SIZE.auto}
        overrides={overrides.modal}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeable
      >
        <styled.ModalHeader>DescribeDomain response</styled.ModalHeader>
        <styled.ModalBody>
          <styled.ViewContainer>
            <PrettyJson json={props.domainDescription as Record<string, any>} />
            <styled.ButtonsContainer>
              <Button
                data-testid="download-json-button"
                size={BUTTON_SIZE.mini}
                kind={BUTTON_KIND.secondary}
                shape={BUTTON_SHAPE.circle}
                overrides={overrides.jsonButton}
                onClick={() =>
                  downloadJson(
                    props.domainDescription,
                    `${props.domainDescription.name}-${props.domainDescription.id}`
                  )
                }
              >
                <MdOutlineCloudDownload size={16} />
              </Button>
              <CopyTextButton
                textToCopy={textToCopy}
                overrides={overrides.jsonButton}
              >
                <MdCopyAll size={16} />
              </CopyTextButton>
            </styled.ButtonsContainer>
          </styled.ViewContainer>
        </styled.ModalBody>
        <styled.ModalFooter>
          <ModalButton
            size={BUTTON_SIZE.compact}
            type="button"
            kind={BUTTON_KIND.primary}
            onClick={() => setIsOpen(false)}
          >
            Close
          </ModalButton>
        </styled.ModalFooter>
      </Modal>
    </>
  );
}
