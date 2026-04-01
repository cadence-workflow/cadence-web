import { useMemo } from 'react';

import NextLink from 'next/link';

import TableInfiniteScrollLoader from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader';

import { styled } from './workflows-list.styles';
import { type Props } from './workflows-list.types';

export default function WorkflowsList({
  workflows,
  columns,
  isLoading,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: Props) {
  const gridTemplateColumns = useMemo(
    () => columns.map((col) => col.width).join(' '),
    [columns]
  );

  const shouldShowResults = !isLoading && workflows.length > 0;

  return (
    <div>
      <styled.ScrollArea>
        {/* TODO @adhitya.mamallan - add a scroll shadow here */}
        <styled.Container>
          <styled.GridHeader $gridTemplateColumns={gridTemplateColumns}>
            {columns.map((col) => (
              <styled.HeaderCell key={col.id}>{col.name}</styled.HeaderCell>
            ))}
          </styled.GridHeader>
          {shouldShowResults &&
            workflows.map((workflow, index) => (
              <styled.GridRow
                key={`${workflow.workflowID}-${workflow.runID}-${index}`}
                $as={NextLink}
                href={`workflows/${encodeURIComponent(workflow.workflowID)}/${encodeURIComponent(workflow.runID)}`}
                prefetch={false}
                $gridTemplateColumns={gridTemplateColumns}
              >
                {columns.map((col) => (
                  <styled.GridCell key={col.id}>
                    {col.renderCell(workflow)}
                  </styled.GridCell>
                ))}
              </styled.GridRow>
            ))}
        </styled.Container>
      </styled.ScrollArea>
      <styled.FooterContainer>
        <TableInfiniteScrollLoader
          hasData={workflows.length > 0}
          error={error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </styled.FooterContainer>
    </div>
  );
}
