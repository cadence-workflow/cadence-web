import React, { useCallback, useMemo, useState } from 'react';

import { SIZE as BUTTON_SIZE } from 'baseui/button';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
} from 'baseui/modal';
import { Tab, Tabs } from 'baseui/tabs-motion';
import { ParagraphXSmall } from 'baseui/typography';
import { useParams } from 'next/navigation';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowPageCliCommandsGroupsConfig from '../config/workflow-page-cli-commands-groups.config';
import workflowPageCliCommandsConfig from '../config/workflow-page-cli-commands.config';
import type { WorkflowPageParams } from '../workflow-page.types';

import substituteCliCommandParams, {
  substituteCliCommandParamsJSX,
} from './helpers/substitute-cli-command-params';
import { cssStyles } from './workflow-page-cli-commands-modal.styles';
import {
  type Props,
  type CliCommandGroups,
} from './workflow-page-cli-commands-modal.types';

export default function WorkflowPageCliCommandsModal({
  isOpen,
  onClose,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);
  const params = useParams<WorkflowPageParams>();

  const substituteParams = useCallback(
    (command: string) => substituteCliCommandParams(command, params ?? {}),
    [params]
  );

  const [selectedTab, setSelectedTab] = useState<CliCommandGroups>(
    workflowPageCliCommandsGroupsConfig[0].name
  );
  const currentTabCommands = useMemo(() => {
    return workflowPageCliCommandsConfig.filter(
      ({ group }) => group === selectedTab
    );
  }, [selectedTab]);

  return (
    <Modal size={SIZE.auto} isOpen={isOpen} onClose={onClose} closeable>
      <ModalHeader>
        CLI commands
        <ParagraphXSmall color={theme.colors.contentSecondary}>
          Here are some useful common CLI commands to get started with Cadence.
        </ParagraphXSmall>
      </ModalHeader>
      <ModalBody>
        <Tabs
          activeKey={selectedTab}
          onChange={({ activeKey }) => {
            setSelectedTab(activeKey.toString() as CliCommandGroups);
          }}
        >
          {workflowPageCliCommandsGroupsConfig.map(({ name, title }) => (
            <Tab key={name} title={title} />
          ))}
        </Tabs>
        <div className={cls.commandsScrollContainer}>
          {currentTabCommands.map(({ label, command, description }) => {
            const substitutedCommand = substituteParams(command);
            const substitutedCommandJSX = substituteCliCommandParamsJSX(
              command,
              params ?? {},
              cls.paramHighlight
            );
            return (
              <div key={label} className={cls.rowContainer}>
                <div className={cls.rowLabel}>{label}</div>
                <div className={cls.rowDetails}>
                  <div className={cls.commandContainer}>
                    <div>{substitutedCommandJSX}</div>
                    <div className={cls.copyButtonContainer}>
                      <CopyTextButton textToCopy={substitutedCommand} />
                    </div>
                  </div>
                  <div className={cls.commandDescription}>{description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <ModalButton size={BUTTON_SIZE.compact} onClick={onClose}>
          Close
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}
