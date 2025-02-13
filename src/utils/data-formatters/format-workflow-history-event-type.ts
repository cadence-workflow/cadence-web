import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

// Utility type to capitalize the first letter
type CapitalizeFirstLetter<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T;

// Utility type to remove 'EventAttributes' suffix
type RemoveEventAttributes<T extends string> =
  T extends `${infer Prefix}EventAttributes` ? Prefix : T;

// Combine both transformations: capitalize and remove 'EventAttributes'
type TransformEventType<T extends string> = CapitalizeFirstLetter<
  RemoveEventAttributes<T>
>;

const formatWorkflowHistoryEventType = <T extends HistoryEvent['attributes']>(
  attributes: T
) => {
  if (!attributes) return attributes;

  return `${attributes[0].toUpperCase()}${attributes.slice(1)}`.replace(
    'EventAttributes',
    ''
  ) as TransformEventType<T>;
};

export default formatWorkflowHistoryEventType;
