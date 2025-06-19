import {
  type QueryJsonContent,
  type Props,
} from '../workflow-queries-result.types';

export default function getQueryResultContent(props: Props): QueryJsonContent {
  if (props.loading) {
    return { contentType: 'json', content: undefined, isError: false };
  }

  if (props.error) {
    return {
      contentType: 'json',
      content: {
        message: props.error.message,
      },
      isError: true,
    };
  }

  if (props.data) {
    if (props.data.rejected) {
      return {
        contentType: 'json',
        content:
          'Workflow is closed with status ' + props.data.rejected.closeStatus,
        isError: true,
      };
    }

    if (
      props.data.result.cadenceResponseType === 'formattedData' &&
      props.data.result.format === 'text/markdown'
    ) {
      return {
        contentType: 'markdown',
        content: props.data.result.data,
        isError: false,
      };
    }
    return { contentType: 'json', content: props.data.result, isError: false };
  }

  return { contentType: 'json', content: undefined, isError: false };
}
