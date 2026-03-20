import type { WorkflowPageParams } from '../../workflow-page.types';
import {
  PLACEHOLDER_MAP,
  PLACEHOLDER_REGEX,
} from '../workflow-page-cli-commands-modal.constants';

export default function substituteCliCommandParams(
  command: string,
  params: Partial<WorkflowPageParams>
): string {
  return command.replace(PLACEHOLDER_REGEX, (match) => {
    const paramKey = PLACEHOLDER_MAP[match];
    return (paramKey && params?.[paramKey]) ?? match;
  });
}
