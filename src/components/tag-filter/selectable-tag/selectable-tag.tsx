import { useStyletron } from 'baseui';
import { mergeOverrides } from 'baseui/helpers/overrides';
import { Tag } from 'baseui/tag';

import { overrides } from './selectable-tag.styles';
import { type Props } from './selectable-tag.types';

export default function SelectableTag({ value, onClick, ...tagProps }: Props) {
  const [_, theme] = useStyletron();

  return (
    <Tag
      closeable={false}
      kind={value ? 'primary' : 'neutral'}
      variant="solid"
      color={value ? theme.colors.contentPrimary : theme.colors.contentTertiary}
      onClick={onClick}
      {...tagProps}
      overrides={mergeOverrides(overrides.tag, tagProps.overrides)}
    />
  );
}
