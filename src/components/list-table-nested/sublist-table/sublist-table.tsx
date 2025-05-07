import { styled } from './sublist-table.styles';
import { type Props } from './sublist-table.types';

export default function SublistTable({ items }: Props) {
  return (
    <styled.Sublist>
      {items.map((sublistItem) => (
        <styled.SublistItem key={sublistItem.key}>
          <styled.SublistItemLabel>
            {sublistItem.label}:
          </styled.SublistItemLabel>
          <styled.SublistItemValue>{sublistItem.value}</styled.SublistItemValue>
        </styled.SublistItem>
      ))}
    </styled.Sublist>
  );
}
