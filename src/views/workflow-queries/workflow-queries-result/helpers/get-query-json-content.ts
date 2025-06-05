import {
  type QueryJsonContent,
  type Props,
} from '../workflow-queries-result.types';

export default function getQueryJsonContent(props: Props): QueryJsonContent {
  if (props.loading) {
    return { content: undefined, isError: false };
  }

  if (props.error) {
    return {
      content: {
        message: props.error.message,
      },
      isError: true,
    };
  }

  if (props.data) {
    if (props.data.rejected) {
      return {
        content:
          'Workflow is closed with status ' + props.data.rejected.closeStatus,
        isError: true,
      };
    }

    if (
      props.data.result.format &&
      props.data.result.format === 'text/markdown'
    ) {
      return {
        content: {
          type: 'markdown',
          content: props.data.result.data,
        },
        isError: false,
      };
    }
    return { content: props.data.result, isError: false };
  }

  return { content: undefined, isError: false };
}
