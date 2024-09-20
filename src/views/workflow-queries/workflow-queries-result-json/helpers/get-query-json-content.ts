import {
  type QueryJsonContent,
  type Props,
} from '../workflow-queries-result-json.types';

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

    return { content: props.data.result, isError: false };
  }

  return { content: undefined, isError: false };
}
