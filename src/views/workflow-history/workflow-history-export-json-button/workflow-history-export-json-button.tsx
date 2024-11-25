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
import logger from '@/utils/logger';
import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request';
import { RequestError } from '@/utils/request/request-error';

import { type Props } from './workflow-history-export-json-button.types';

export default function WorkflowHistoryExportJsonButton(props: Props) {
  const nextPage = useRef<string>();
  const [loadingState, setLoadingState] = useState<
    'loading' | 'error' | 'idle'
  >('idle');

  const downloadJSON = (jsonData: any) => {
    const blob = new Blob([losslessJsonStringify(jsonData, null, '\t')], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-${props.workflowId}-${props.runId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExport = async () => {
    try {
      const eventsToExport: (FormattedHistoryEvent | null)[] = [];
      setLoadingState('loading');
      do {
        const res = await request(
          `/api/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}/history?${queryString.stringify({ pageSize: 500, nextPage: nextPage.current }, { skipEmptyString: true })}`
        );
        const data: GetWorkflowHistoryResponse = await res.json();
        nextPage.current = data.nextPageToken;
        const events = data.history?.events || [];
        const formattedEvents = events.map(formatWorkflowHistoryEvent);
        eventsToExport.push(...formattedEvents);
      } while (nextPage.current);

      setLoadingState('idle');
      downloadJSON(eventsToExport);
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
        endEnhancer={loadingState === 'loading' && <Spinner $size={16} />}
      >
        Export JSON
      </Button>
    </>
  );
}
