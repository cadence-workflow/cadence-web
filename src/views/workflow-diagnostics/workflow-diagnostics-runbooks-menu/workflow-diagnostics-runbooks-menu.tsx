import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import { MdArrowDropDown, MdOpenInNew } from 'react-icons/md';

import Link from '@/components/link/link';

import { overrides, styled } from './workflow-diagnostics-runbooks-menu.styles';

export default function WorkflowDiagnosticsRunbooksMenu({
  runbooks,
}: {
  runbooks: Array<string>;
}) {
  if (runbooks.length === 0) return null;
  if (runbooks.length === 1)
    return (
      <Link href={runbooks[0]} target="_blank" rel="noreferrer">
        <styled.SingleRunbookLink>
          View runbook
          <MdOpenInNew />
        </styled.SingleRunbookLink>
      </Link>
    );

  return (
    <StatefulPopover
      placement="bottomRight"
      overrides={overrides.popover}
      content={
        <>
          {runbooks.map((runbook) => (
            <styled.MenuItem key={runbook}>
              <Button
                kind="tertiary"
                size="compact"
                overrides={overrides.menuItemButton}
                $as={Link}
                target="_blank"
                rel="noreferrer"
                href={runbook}
              >
                <styled.MenuItemContent>
                  {runbook}
                  <MdOpenInNew />
                </styled.MenuItemContent>
              </Button>
            </styled.MenuItem>
          ))}
        </>
      }
    >
      <Button
        size="mini"
        kind="tertiary"
        endEnhancer={<MdArrowDropDown size={20} />}
        overrides={overrides.runbooksButton}
      >
        Runbooks
      </Button>
    </StatefulPopover>
  );
}
