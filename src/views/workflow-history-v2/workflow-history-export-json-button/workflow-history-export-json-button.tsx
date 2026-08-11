'use client';
import { useRef, useState } from 'react';

import { Button } from 'baseui/button';
import { Spinner } from 'baseui/spinner';
import { ToasterContainer, toaster } from 'baseui/toast';
import queryString from 'query-string';
import { MdOutlineCloudDownload } from 'react-icons/md';

import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEvent } from '@/utils/data-formatters/schema/format-history-event-schema';
import downloadJson from '@/utils/download-json';
import logger from '@/utils/logger';
import request from '@/utils/request';
import { RequestError } from '@/utils/request/request-error';

import { type Props } from './workflow-history-export-json-button.types';

export default function WorkflowHistoryExportJsonButton(props: Props) {
  const nextPage = useRef<string>();
  const [loadingState, setLoadingState] = useState<
    'loading' | 'error' | 'idle'
  >('idle');

  const handleExport = async () => {
    try {
      const eventsToExport: (FormattedHistoryEvent | null)[] = [];
      setLoadingState('loading');
      do {
        const res = await request(
          queryString.stringifyUrl(
            {
              url: `/api/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}/history`,
              query: { pageSize: 500, nextPage: nextPage.current },
            },
            { skipEmptyString: true }
          )
        );
        const data: GetWorkflowHistoryResponse = await res.json();
        nextPage.current = data.nextPageToken;
        const events = data.history?.events || [];
        const formattedEvents = events.map(formatWorkflowHistoryEvent);
        eventsToExport.push(...formattedEvents);
      } while (nextPage.current);

      setLoadingState('idle');
      downloadJson(
        eventsToExport,
        `history-${props.workflowId}-${props.runId}`
      );
    } catch (e) {
      if (!(e instanceof RequestError)) {
        logger.error(e, 'Failed to export workflow');
      }
      toaster.negative('Failed to export workflow history');
      setLoadingState('error');
    }
  };

  return (
    <>
      <ToasterContainer autoHideDuration={2000} placement="bottom" />
      <Button
        $size="compact"
        kind="secondary"
        startEnhancer={<MdOutlineCloudDownload size={16} />}
        onClick={handleExport}
        endEnhancer={
          loadingState === 'loading' ? <Spinner $size={16} /> : undefined
        }
      >
        Export JSON
      </Button>
    </>
  );
}
